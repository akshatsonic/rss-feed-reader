import React from 'react';
import { motion } from 'framer-motion';
import { IoCalendarOutline } from 'react-icons/io5';
import { format, parseISO } from 'date-fns';
import { useTheme } from '../contexts/ThemeContext';

import {
  FeedCard as StyledFeedCard,
  CardImage,
  CardContent,
  CardTitle,
  CardMeta,
  CardDate,
  CardExcerpt
} from '../styles/StyledComponents';

/**
 * Card component for displaying RSS feed items
 */
const FeedCard = ({ item, onClick, theme: propTheme }) => {
  // Use theme from context if not provided as prop
  const themeContext = useTheme();
  const theme = propTheme || { isDarkMode: themeContext.isDarkMode };
  // Format publication date with error handling for different date formats
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    try {
      // Try parsing as ISO format first
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (error) {
      try {
        // Try parsing as a regular date string
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
          return format(date, 'MMM d, yyyy');
        }
      } catch (e) {
        console.error('Failed to parse date:', dateString, e);
      }
      
      // If all parsing fails, just return the date string or unknown
      return dateString || 'Unknown date';
    }
  };
  
  const formattedDate = formatDate(item.pubDate);

  // Remove HTML tags from content for excerpt
  const stripHtmlTags = (html) => {
    return html.replace(/<[^>]*>?/gm, '');
  };

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
      }
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 10 
      }
    }
  };

  return (
    <motion.div
      layoutId={`card-container-${item.id}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onClick={() => onClick(item)}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      className="feed-card" // For potential CSS targeting
    >
      <StyledFeedCard theme={theme}>
      <CardImage 
        src={item.thumbnail} 
        $layoutId={`card-image-${item.id}`}
        theme={theme}
      />
      <CardContent theme={theme}>
        <CardTitle $layoutId={`card-title-${item.id}`} theme={theme}>
          {item.title}
        </CardTitle>
        <CardMeta theme={theme}>
          <CardDate theme={theme}>
            <IoCalendarOutline />
            {formattedDate}
          </CardDate>
        </CardMeta>
        <CardExcerpt theme={theme}>
          {stripHtmlTags(item.content).substring(0, 120)}
          {stripHtmlTags(item.content).length > 120 ? '...' : ''}
        </CardExcerpt>
      </CardContent>
    </StyledFeedCard>
    </motion.div>
  );
};

export default FeedCard;
