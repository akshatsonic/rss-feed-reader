import axios from 'axios';
import { getFeedSourceById } from '../config/appConfig';

// Local proxy server endpoint
const API_ENDPOINT = 'http://localhost:3001/api/rss';

/**
 * Service for fetching and parsing RSS feeds
 */
export const RssService = {
  /**
   * Normalize an RSS feed that may not be in the expected format
   * @param {Object} data - The feed data to normalize
   * @param {string} feedUrl - The original feed URL
   * @returns {Object} - Normalized feed object
   */
  normalizeRssFeed(data, feedUrl) {
    console.log('Normalizing feed data:', data);
    
    // Handle different RSS feed formats
    let title = 'Unknown Feed';
    let description = '';
    let link = feedUrl;
    let items = [];
    
    // Check various common RSS formats
    if (data.rss && data.rss.channel) {
      // Standard RSS 2.0 format accessed differently
      const channel = data.rss.channel;
      title = channel.title || title;
      description = channel.description || description;
      link = channel.link || link;
      items = Array.isArray(channel.item) ? channel.item : [];
    } else if (data.feed) {
      // Some Atom formats
      title = data.feed.title || title;
      description = data.feed.subtitle || description;
      link = data.feed.link?.href || data.feed.link || link;
      items = data.feed.entry || [];
    } else if (data.channel) {
      // Another common format
      title = data.channel.title || title;
      description = data.channel.description || description;
      link = data.channel.link || link;
      items = data.channel.item || [];
    } else {
      // If we can't identify a standard format, try to extract items
      // from common property names
      const possibleItemProps = ['entries', 'items', 'posts', 'article'];
      for (const prop of possibleItemProps) {
        if (Array.isArray(data[prop])) {
          items = data[prop];
          break;
        }
      }
      
      // If still no items, check if data itself is an array of items
      if (items.length === 0 && Array.isArray(data)) {
        items = data;
      }
    }
    
    // Get source identifier from URL
    const sourceId = this.getFeedSource(feedUrl);
    
    // Normalize the items
    const normalizedItems = items.map((item, index) => {
      return {
        id: item.guid || item.id || item.link || `item-${index}-${Date.now()}`,
        title: item.title || 'Untitled Item',
        content: item.content || item.contentSnippet || item.description || item.summary || '',
        link: item.link?.href || item.link || '',
        pubDate: item.pubDate || item.isoDate || item.published || item.updated || new Date().toISOString(),
        author: item.creator || item.author?.name || item.author || 'Unknown',
        categories: item.categories || [],
        thumbnail: extractThumbnail(item),
        source: sourceId, // Add source identification
      };
    });
    
    return {
      title,
      description,
      link,
      items: normalizedItems
    };
  },
  
  /**
   * Fetch and parse an RSS feed from a URL
   * @param {string} feedUrl - The URL of the RSS feed
   * @returns {Promise<Array>} - Array of feed items
   */
  async fetchFeed(feedUrl) {
    try {
      console.log('Fetching feed from:', feedUrl);
      
      // Get source identifier from URL
      const sourceId = this.getFeedSource(feedUrl);
      
      // Use our local proxy server to fetch the feed
      const response = await axios.get(API_ENDPOINT, {
        params: { url: feedUrl }
      });
      
      const feed = response.data;
      // Add source ID to feed object
      feed.source = sourceId;
      console.log('Feed data received:', feed);
      
      // If feed is not in expected format, normalize it
      if (!feed) {
        console.warn('Empty feed received, using empty placeholder');
        return {
          title: 'Empty Feed',
          description: 'No content available',
          link: feedUrl,
          items: []
        };
      }
      
      if (!feed.items) {
        console.warn('RSS feed not in expected format, attempting to normalize');
        return this.normalizeRssFeed(feed, feedUrl);
      }

      // Safety check for items array
      if (!Array.isArray(feed.items)) {
        console.warn('Feed items is not an array, converting to array');
        feed.items = feed.items ? [feed.items] : [];
      }
      
      return {
        title: feed.title,
        description: feed.description,
        link: feed.link,
        source: this.getFeedSource(feedUrl), // Add source identifier
        items: feed.items.map(item => ({
          id: item.guid || item.id || item.link,
          title: item.title,
          content: item.content || item.contentSnippet || item.description || '',
          link: item.link,
          pubDate: item.pubDate || item.isoDate,
          author: item.creator || item.author || 'Unknown',
          categories: item.categories || [],
          thumbnail: extractThumbnail(item),
          source: this.getFeedSource(feedUrl), // Add source to each item
        }))
      };
    } catch (error) {
      console.error('Error fetching RSS feed:', error);
      throw error;
    }
  }
};

/**
 * Extract thumbnail from RSS item
 * @param {Object} item - RSS item
 * @returns {string|null} - URL of thumbnail or null if not found
 */
function extractThumbnail(item) {
  // Try to find media:content or enclosure
  if (item.media && item.media.content && item.media.content.url) {
    return item.media.content.url;
  }

  if(item.mediaThumbnail && item.mediaThumbnail.$ && item.mediaThumbnail.$.url) {
    return item.mediaThumbnail.$.url;
  }
  
  if (item.enclosure && item.enclosure.url) {
    return item.enclosure.url;
  }
  
  // Try to extract from content
  if (item.content) {
    const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch && imgMatch[1]) {
      return imgMatch[1];
    }
  }
  
  return null;
}

/**
 * Determine the source identifier from feed URL
 * @param {string} url - The feed URL
 * @returns {string} - Source identifier
 */
function getFeedSource(url) {
  if (!url) return 'unknown';
  
  // Common sources pattern matching
  if (url.includes('theverge.com')) return 'verge';
  if (url.includes('wired.com')) return 'wired';
  if (url.includes('techcrunch.com')) return 'techcrunch';
  if (url.includes('feedburner.com')) return 'feedburner';
  
  // Extract domain as fallback identifier
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    return domain.split('.')[0];
  } catch (e) {
    return 'unknown';
  }
}

/**
 * Get source details from URL
 * @param {string} url - The feed URL
 * @returns {Object|null} - Source details or null
 */
function getSourceDetails(url) {
  const sourceId = getFeedSource(url);
  return getFeedSourceById(sourceId);
}

// Add methods to the RssService object
RssService.getFeedSource = getFeedSource;
RssService.getSourceDetails = getSourceDetails;
