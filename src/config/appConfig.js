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
    logo: 'https://platform.theverge.com/wp-content/uploads/sites/2/2025/01/verge-rss-large_80b47e.png?w=150&h=150&crop=1',
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
    logo: 'https://www.wired.com/favicon.ico',
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
    logo: 'https://techcrunch.com/wp-content/uploads/2015/02/cropped-cropped-favicon-gradient.png?w=32',
    displayOptions: {
      showModalThumbnail: true,
      maxExcerptLength: 100,
      preferredImageSize: 'medium'
    },
    feedProperties: {
      missingThumbnails: true,     // Flag indicating this feed typically lacks thumbnails
      placeholderImage: 'https://techcrunch.com/wp-content/uploads/2021/01/TC-logo-2.jpg'  // Optional placeholder image
    },
    enabled: true
  },
  {
    id: 'cnet',
    name: 'CNET',
    url: 'https://www.cnet.com/rss/news/',
    color: '#dc0000', // CNET red color
    icon: 'tech',
    logo: 'https://www.cnet.com/favicon.ico',
    displayOptions: {
      showModalThumbnail: true,
      maxExcerptLength: 100,
      preferredImageSize: 'medium'
    },
    feedProperties: {
      missingThumbnails: false,
      placeholderImage: 'https://www.cnet.com/a/img/resize/08bdf2e50f95495d61237e84d2b4857df1679c92/hub/2021/10/20/aefb5c5c-47d3-4a3a-91ab-e14ddaa2684a/cnet-logo-red-bg-1200x630.png?auto=webp&fit=crop&height=630&width=1200'
    },
    enabled: true
  },
  {
    id: 'zerodha',
    name: 'Zerodha Tech',
    url: 'https://zerodha.tech/index.xml',
    color: '#387ed1', // Zerodha brand blue color
    icon: 'finance',
    logo: 'https://zerodha.tech/static/images/favicon.png',
    displayOptions: {
      showModalThumbnail: true,
      maxExcerptLength: 150,
      preferredImageSize: 'medium'
    },
    feedProperties: {
      missingThumbnails: true,
      placeholderImage: 'https://zerodha.tech/static/images/logo.svg'
    },
    enabled: true
  }
];

// Default display configuration
export const defaultDisplayOptions = {
  showModalThumbnail: true,
  maxExcerptLength: 120,
  preferredImageSize: 'medium',
  darkModeEnabled: true  // Dark mode enabled by default
};

// Default feed properties
export const defaultFeedProperties = {
  missingThumbnails: false,
  placeholderImage: 'https://via.placeholder.com/300x200?text=No+Thumbnail'
};

// Default logo configuration
export const defaultLogo = {
  url: null,  // Will use FaRss icon if no URL is provided
  size: 20,   // Default logo size in pixels
  fallbackIcon: 'rss'  // Icon to use if logo fails to load
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
 * Check if a feed source typically has missing thumbnails
 * @param {string} sourceId - Source identifier
 * @returns {boolean} - Whether the feed typically has missing thumbnails
 */
export const hasMissingThumbnails = (sourceId) => {
  const source = getFeedSourceById(sourceId);
  if (!source || !source.feedProperties) return defaultFeedProperties.missingThumbnails;
  return !!source.feedProperties.missingThumbnails;
};

/**
 * Get placeholder image for a source when thumbnails are missing
 * @param {string} sourceId - Source identifier
 * @returns {string} - URL to placeholder image
 */
export const getPlaceholderImage = (sourceId) => {
  const source = getFeedSourceById(sourceId);
  if (!source || !source.feedProperties || !source.feedProperties.placeholderImage) {
    return defaultFeedProperties.placeholderImage;
  }
  return source.feedProperties.placeholderImage;
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
