// Serverless function to handle RSS feed requests on Vercel
const axios = require('axios');
const Parser = require('rss-parser');

// Initialize parser with the same options as in server.js
const parser = new Parser({
  customFields: {
    feed: [
      'subtitle',
      'icon',
      'logo',         // For Atom feeds
      'updated',      // Atom last updated
      'generator',    // Common in both
      'language',     // RSS/Atom
      ['itunes:author', 'itunesAuthor'], // iTunes podcast feeds
      ['itunes:summary', 'itunesSummary'],
      ['itunes:image', 'itunesImage'],
      ['itunes:category', 'itunesCategory']
    ],
    item: [
      'media:content',
      'enclosure',
      'content:encoded',
      'content',
      'summary',      // Atom
      'description',  // RSS
      'pubDate',      // RSS
      'published',    // Atom
      'updated',      // Atom
      ['itunes:duration', 'itunesDuration'],
      ['itunes:episode', 'itunesEpisode'],
      ['itunes:season', 'itunesSeason'],
      ['itunes:explicit', 'itunesExplicit'],
      ['media:thumbnail', 'mediaThumbnail'],
      ['media:description', 'mediaDescription']
    ]
  }
});

// Handler function for the API endpoint
module.exports = async (req, res) => {
  // Enable CORS headers for all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS requests (preflight CORS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Extract URL parameter
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  console.log(`Fetching RSS feed from: ${url}`);

  try {
    // Some feeds require different handling
    const isFeedburner = url.includes('feedburner.com');
    const isPCMag = url.includes('pcmag.com');
    const isRestrictedSite = isPCMag || url.includes('restricted-domain.com');
    
    // Set up request config with browser-like headers
    const requestConfig = {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'max-age=0',
        'Connection': 'keep-alive',
        'Sec-Ch-Ua': '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"macOS"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'Referer': 'https://www.google.com/'
      }
    };
    
    // Make the request to fetch RSS feed
    const response = await axios.get(url, requestConfig);
    
    // Check the response
    if (!response.data || typeof response.data !== 'string') {
      console.error('Invalid response data:', response.data ? typeof response.data : 'empty');
      return res.status(500).json({
        error: 'Invalid feed data received',
        message: 'Response was not in expected format'
      });
    }
    
    // Parse the feed
    let feed;
    try {
      feed = await parser.parseString(response.data);
      console.log('Feed parsed successfully');
      
    } catch (parseError) {
      console.error('RSS parsing failed:', parseError.message);
      
      // Attempt fallback parsing for problematic feeds
      try {
        // Extract title with regex as last resort
        const titleMatch = response.data.match(/<title>([^<]+)<\/title>/);
        const title = titleMatch ? titleMatch[1] : url;
        
        // Extract items with regex
        const itemRegex = /<item>[\s\S]*?<title>([^<]+)<\/title>[\s\S]*?<link>([^<]+)<\/link>[\s\S]*?<\/item>/g;
        const items = [];
        let match;
        
        while ((match = itemRegex.exec(response.data)) !== null) {
          items.push({
            title: match[1],
            link: match[2],
            pubDate: new Date().toISOString()
          });
        }
        
        feed = {
          title: title,
          description: `Feed from ${url}`,
          link: url,
          items: items
        };
        
        console.log(`Fallback parsing created ${items.length} items`);
      } catch (fallbackError) {
        console.error('Fallback parsing also failed:', fallbackError.message);
        return res.status(500).json({
          error: 'Failed to parse RSS feed',
          message: parseError.message
        });
      }
    }
    
    // Ensure feed has minimum required structure
    if (!feed) {
      feed = {
        title: `Feed from ${url}`,
        description: 'Could not properly parse this feed',
        link: url,
        items: []
      };
    }
    
    if (!feed.items) {
      console.warn('Feed parsed but missing items array');
      feed.items = [];
    }
    
    // Return the parsed feed
    return res.status(200).json(feed);
    
  } catch (error) {
    console.error(`Error fetching RSS feed from ${url}:`, error);
    return res.status(500).json({ 
      error: 'Failed to fetch RSS feed', 
      message: error.message,
      url: url
    });
  }
};
