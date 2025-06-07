import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useRssFeed } from '../hooks/useRssFeed';
import { useTheme } from '../contexts/ThemeContext';
import FeedCard from './FeedCard';
import ArticleModal from './ArticleModal';
import FeedLogo from './FeedLogo';
import { getActiveFeedUrls, getActiveFeedSources, feedSources } from '../config/appConfig';
import { FaRss } from 'react-icons/fa';
import { BiError } from 'react-icons/bi';
import { IoRefresh, IoTimeOutline } from 'react-icons/io5';
import { format, formatDistanceToNow } from 'date-fns';
import {
  FeedGrid,
  LoadingContainer,
  Spinner,
  ErrorContainer,
  FeedSelector,
  FeedButton,
  RefreshButton,
  LastUpdateText
} from '../styles/StyledComponents';

/**
 * Container component for displaying RSS feeds
 */
const FeedContainer = ({ customFeeds = [] }) => {
  // Get active feeds from configuration
  const configFeeds = getActiveFeedUrls();
  
  // Combine configured feeds and custom feeds
  const allFeeds = [...configFeeds, ...customFeeds];
  
  // Get all feed source data for display
  const feedSources = getActiveFeedSources();
  
  const [selectedFeedIndex, setSelectedFeedIndex] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState(null);
  
  // Get theme from context
  const { isDarkMode } = useTheme();
  
  // Use our custom hook to fetch the feeds with a 30-minute refresh interval
  const { feeds, loading, error, refreshFeeds, lastFetchTime } = useRssFeed(allFeeds, {
    refreshInterval: 30 * 60 * 1000 // 30 minutes
  });

  // Handle card click to show article modal
  const handleCardClick = (article) => {
    setSelectedArticle(article);
  };

  // Handle closing the article modal
  const handleCloseModal = () => {
    setSelectedArticle(null);
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  // Create a local loading state that can be forced to complete if stuck
  const [localLoading, setLocalLoading] = useState(loading);

  // Update local loading state when the hook's loading state changes
  useEffect(() => {
    setLocalLoading(loading);
  }, [loading]);

  // Set a timeout to prevent infinite loading if something gets stuck
  useEffect(() => {
    let timeoutId;
    if (localLoading) {
      timeoutId = setTimeout(() => {
        console.warn('Loading timeout reached, forcing load completion');
        setLocalLoading(false);
      }, 10000); // 10 seconds timeout
    }
    return () => clearTimeout(timeoutId);
  }, [localLoading]);

  // Display debug info in console (less verbose now)
  useEffect(() => {
    if (loading) {
      console.log('FeedContainer: Loading feeds...');
    } else if (feeds.length > 0) {
      console.log(`FeedContainer: Loaded ${feeds.length} feeds with ${feeds.reduce((sum, feed) => sum + (feed.items?.length || 0), 0)} items`);
    }
  }, [feeds, loading, error, selectedFeedIndex]);

  if (localLoading) {
    return (
      <LoadingContainer theme={{ isDarkMode }}>
        <Spinner 
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 1, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          theme={{ isDarkMode }}
        />
        <p style={{ marginTop: '1rem' }}>Loading feeds...</p>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer theme={{ isDarkMode }}>
        <BiError size={48} />
        <h3>Failed to load RSS feeds</h3>
        <p>Error: {error.message}</p>
        <p>Please check the feed URLs or your connection and try again.</p>
      </ErrorContainer>
    );
  }
  
  if (!feeds || feeds.length === 0) {
    return (
      <ErrorContainer theme={{ isDarkMode }}>
        <BiError size={48} />
        <h3>No feeds available</h3>
        <p>No RSS feeds could be loaded. Please check your feed URLs.</p>
      </ErrorContainer>
    );
  }

  // Get the currently selected feed
  const currentFeed = feeds[selectedFeedIndex];
  
  if (!currentFeed) {
    return (
      <ErrorContainer theme={{ isDarkMode }}>
        <BiError size={48} />
        <h3>No feed selected</h3>
        <p>The selected feed is not available. Please try another one.</p>
      </ErrorContainer>
    );
  }
  
  if (!currentFeed.items || !Array.isArray(currentFeed.items) || currentFeed.items.length === 0) {
    return (
      <ErrorContainer theme={{ isDarkMode }}>
        <BiError size={48} />
        <h3>No items in feed</h3>
        <p>The selected feed doesn't contain any items.</p>
        
        <FeedSelector>
          {feeds.map((feed, index) => {
            // Find source config for this feed
            const sourceId = feed.source || feed.title?.toLowerCase().replace(/\s+/g, '-');
            const sourceConfig = feedSources.find(source => source.id === sourceId) || {};
            
            return (
              <FeedButton
                key={index}
                active={index === selectedFeedIndex}
                theme={{ isDarkMode }}
                onClick={() => setSelectedFeedIndex(index)}
              >
                <FeedLogo 
                  logoUrl={sourceConfig.logo} 
                  feedId={sourceId} 
                  theme={{ isDarkMode }}
                />
                {feed.title || `Feed ${index + 1}`}
              </FeedButton>
            );
          })}
        </FeedSelector>
      </ErrorContainer>
    );
  }

  return (
    <>
      {/* Feed selector buttons */}
      <FeedSelector theme={{ isDarkMode }}>
        {feeds.map((feed, index) => {
          // Find source config for this feed
          const sourceId = feed.source || feed.title?.toLowerCase().replace(/\s+/g, '-');
          const sourceConfig = feedSources.find(source => source.id === sourceId) || {};
          
          return (
            <FeedButton
              key={index}
              $active={index === selectedFeedIndex}
              theme={{ isDarkMode }}
              onClick={() => setSelectedFeedIndex(index)}
            >
              <FeedLogo 
                logoUrl={sourceConfig.logo} 
                feedId={sourceId} 
                theme={{ isDarkMode }}
              />
              {feed.title || `Feed ${index + 1}`}
            </FeedButton>
          );
        })}
        
        <RefreshButton 
          onClick={refreshFeeds} 
          title="Refresh feeds"
          disabled={loading || localLoading}
          theme={{ isDarkMode }}
        >
          <IoRefresh size={18} />
        </RefreshButton>
        
        {lastFetchTime && (
          <LastUpdateText title={lastFetchTime.toLocaleString()} theme={{ isDarkMode }}>
            <IoTimeOutline size={14} />
            Updated {formatDistanceToNow(lastFetchTime, { addSuffix: true })}
          </LastUpdateText>
        )}
      </FeedSelector>

      {/* Feed items grid */}
      <LayoutGroup>
        <FeedGrid
          as={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          theme={{ isDarkMode }}
        >
          <AnimatePresence>
            {currentFeed.items.map((item) => (
              <FeedCard
                key={item.id}
                item={item}
                onClick={handleCardClick}
                theme={{ isDarkMode }}
              />
            ))}
          </AnimatePresence>
        </FeedGrid>

        {/* Article modal */}
        <ArticleModal
          isOpen={!!selectedArticle}
          onClose={handleCloseModal}
          article={selectedArticle}
          theme={{ isDarkMode }}
        />
      </LayoutGroup>
    </>
  );
};

export default FeedContainer;
