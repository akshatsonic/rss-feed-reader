import { useState, useEffect, useRef } from 'react';
import { RssService } from '../services/RssService';

/**
 * Custom hook for managing RSS feed data
 * @param {string|string[]} feedUrls - Single URL or array of URLs
 * @returns {Object} - Feed data and loading state
 */
// Feed request cache to prevent redundant requests
const feedCache = {};

// Default refresh interval in milliseconds (10 minutes)
const DEFAULT_REFRESH_INTERVAL = 10 * 60 * 1000;

/**
 * Custom hook for managing RSS feed data with request throttling
 * @param {string|string[]} feedUrls - Single URL or array of URLs
 * @param {Object} options - Hook configuration options
 * @param {number} options.refreshInterval - How often to refresh feeds (ms)
 * @returns {Object} - Feed data and loading state
 */
export const useRssFeed = (feedUrls, options = {}) => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  
  // Store options in a ref to avoid dependencies changes
  const optionsRef = useRef(options);
  const { refreshInterval = DEFAULT_REFRESH_INTERVAL } = optionsRef.current;
  
  // Track in-flight requests to prevent duplicates
  const fetchInProgress = useRef(false);
  
  // Use refs to store cached URLs to prevent unnecessary fetches
  const prevUrlsRef = useRef(null);

  useEffect(() => {
    const fetchFeeds = async () => {
      // Don't fetch if there's already a request in progress
      if (fetchInProgress.current) {
        console.log('Fetch already in progress, skipping redundant request');
        return;
      }
      
      // Check if we're within the refresh interval
      if (lastFetchTime && (Date.now() - lastFetchTime < refreshInterval)) {
        console.log(`Skipping feed fetch, next refresh in ${((lastFetchTime + refreshInterval) - Date.now())/1000}s`);
        return;
      }
      
      // Check if the URLs are the same as before
      const urlsJson = JSON.stringify(feedUrls);
      if (prevUrlsRef.current === urlsJson && feeds.length > 0) {
        console.log('Feed URLs unchanged, using cached results');
        setLoading(false);
        return;
      }
      
      // Set the request flag to prevent parallel fetches
      fetchInProgress.current = true;
      prevUrlsRef.current = urlsJson;
      
      setLoading(true);
      setError(null);
      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching feeds for URLs:', feedUrls);
        const urls = Array.isArray(feedUrls) ? feedUrls : [feedUrls];
        
        if (urls.length === 0) {
          console.warn('No feed URLs provided');
          setFeeds([]);
          setLoading(false);
          fetchInProgress.current = false;
          return;
        }
        
        // Check cache for each URL first
        const feedPromises = urls.map(url => {
          // Check if we have a fresh cached result
          if (feedCache[url] && (Date.now() - feedCache[url].timestamp < refreshInterval)) {
            console.log(`Using cached feed for ${url}`);
            return Promise.resolve(feedCache[url].data);
          }
          
          // Otherwise fetch fresh data
          return RssService.fetchFeed(url).then(data => {
            // Cache the result with timestamp
            feedCache[url] = {
              data,
              timestamp: Date.now()
            };
            return data;
          });
        });
        
        const results = await Promise.allSettled(feedPromises);
        console.log(`Feed fetch completed at ${new Date().toLocaleTimeString()}`);
        
        // Check for any rejected promises and log their errors
        results
          .filter(result => result.status === 'rejected')
          .forEach((result, index) => {
            console.error(`Error fetching feed ${index}:`, result.reason);
          });
        
        const successfulFeeds = results
          .filter(result => result.status === 'fulfilled')
          .map(result => result.value)
          .filter(feed => feed && feed.items && Array.isArray(feed.items));
        
        if (successfulFeeds.length === 0 && results.length > 0) {
          // All promises rejected or returned invalid data
          throw new Error('Failed to fetch any valid feeds');
        }
        
        setFeeds(successfulFeeds);
        setLastFetchTime(Date.now());
      } catch (err) {
        console.error('Error in useRssFeed:', err);
        setError(err);
      } finally {
        setLoading(false);
        fetchInProgress.current = false;
      }
    };

    // Only fetch if we have URLs
    if (feedUrls && (Array.isArray(feedUrls) ? feedUrls.length > 0 : true)) {
      fetchFeeds();
    }
    
    // Set up refresh interval if specified
    let intervalId;
    if (refreshInterval > 0) {
      intervalId = setInterval(() => {
        console.log('Checking for feed updates...');
        if (Date.now() - lastFetchTime >= refreshInterval) {
          fetchFeeds();
        }
      }, Math.min(refreshInterval, 60000)); // Check at most once per minute
    }
    
    return () => {
      // Clean up interval on unmount
      if (intervalId) clearInterval(intervalId);
    };
  }, [feedUrls, lastFetchTime]); // Deliberately exclude refreshInterval to avoid re-creating the effect

  // Provide a manual refresh function
  const refreshFeeds = () => {
    // Clear cache for all URLs
    const urls = Array.isArray(feedUrls) ? feedUrls : [feedUrls];
    urls.forEach(url => delete feedCache[url]);
    setLastFetchTime(0); // Force a refresh
  };

  return { 
    feeds, 
    loading, 
    error,
    refreshFeeds, // Allow manual refreshing
    lastFetchTime: lastFetchTime ? new Date(lastFetchTime) : null
  };
};
