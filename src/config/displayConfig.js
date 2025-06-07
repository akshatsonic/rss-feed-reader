/**
 * Configuration for feed-specific display settings
 */

// Configuration for thumbnail display in article modal
export const thumbnailConfig = {
  // Sources that should NOT show thumbnails in article modal
  hideModalThumbnails: [
    'verge',
    // Add other sources that should not display thumbnails here
  ],
  
  // Default setting if source is not specified
  defaultShowThumbnail: true,
};

/**
 * Determine if a thumbnail should be shown in modal for a given source
 * @param {string} source - The source identifier
 * @returns {boolean} - Whether to show the thumbnail
 */
export const shouldShowModalThumbnail = (source) => {
  if (!source) return thumbnailConfig.defaultShowThumbnail;
  return !thumbnailConfig.hideModalThumbnails.includes(source);
};
