/**
 * Central configuration file for RSS Feed Reader
 * Manage all feed sources and display settings in one place
 */

// Default RSS feed sources
export const feedSources = [
  {
    id: 'verge',
    name: 'The Verge',
    url: 'https://www.theverge.com/rss/index.xml',
    color: '#5270F8',  // Brand color for styling
    icon: 'news',      // Icon identifier (for potential future use)
    displayOptions: {
      showModalThumbnail: false,  // Don't show thumbnails in modal for The Verge
      maxExcerptLength: 120,      // Max length for excerpts
      preferredImageSize: 'medium' // Image size preference
    }
  },
  {
    id: 'wired',
    name: 'WIRED',
    url: 'https://www.wired.com/feed/rss',
    color: '#000000',  // Brand color for styling
    icon: 'tech',
    displayOptions: {
      showModalThumbnail: true,   // Show thumbnails in modal for WIRED
      maxExcerptLength: 120,
      preferredImageSize: 'large'
    }
  },
  // Easy to add new sources:
  {
    id: 'techcrunch',
    name: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
    color: '#0A9E01',
    icon: 'startup',
    displayOptions: {
      showModalThumbnail: true,
      maxExcerptLength: 100,
      preferredImageSize: 'medium'
    },
    enabled: true  // Can be enabled by users later
  }
];

// Default display configuration
export const defaultDisplayOptions = {
  showModalThumbnail: true,
  maxExcerptLength: 120,
  preferredImageSize: 'medium',
  darkModeEnabled: false
};

/**
 * Get feed source by ID
 * @param {string} id - Source identifier
 * @returns {Object|null} - Feed source object or null if not found
 */
export const getFeedSourceById = (id) => {
  if (!id) return null;
  return feedSources.find(source => source.id === id && source.enabled !== false) || null;
};

/**
 * Get active feed sources (enabled or not explicitly disabled)
 * @returns {Array} - Array of active feed sources
 */
export const getActiveFeedSources = () => {
  return feedSources.filter(source => source.enabled !== false);
};

/**
 * Get feed URLs for active sources
 * @returns {Array} - Array of feed URLs
 */
export const getActiveFeedUrls = () => {
  return getActiveFeedSources().map(source => source.url);
};

/**
 * Determine if a thumbnail should be shown in modal for a given source ID
 * @param {string} sourceId - The source identifier
 * @returns {boolean} - Whether to show the thumbnail
 */
export const shouldShowModalThumbnail = (sourceId) => {
  const source = getFeedSourceById(sourceId);
  if (!source) return defaultDisplayOptions.showModalThumbnail;
  return source.displayOptions.showModalThumbnail;
};

/**
 * Get maximum excerpt length for a given source
 * @param {string} sourceId - Source identifier
 * @returns {number} - Maximum excerpt length
 */
export const getMaxExcerptLength = (sourceId) => {
  const source = getFeedSourceById(sourceId);
  if (!source) return defaultDisplayOptions.maxExcerptLength;
  return source.displayOptions.maxExcerptLength;
};
