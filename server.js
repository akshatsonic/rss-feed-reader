const express = require('express');
const cors = require('cors');
const axios = require('axios');
const Parser = require('rss-parser');

// Initialize Express app
const app = express();
const port = 3001;

// Create RSS parser instance with more lenient parsing options

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
  },
  // No need to force defaultRSS, let the parser auto-detect
});

// Enable CORS for all routes
app.use(cors());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler caught:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: err.message 
  });
});

// Endpoint for fetching RSS feeds
app.get('/api/rss', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  console.log(`Fetching RSS feed from: ${url}`);

  try {
    console.log(`Attempting to fetch ${url} with timeout and headers...`);
    
    // Some feeds require different handling (like Feedburner)
    const isFeedburner = url.includes('feedburner.com');
    
    // Check for specific sites that need different headers
    const isPCMag = url.includes('pcmag.com');
    const isRestrictedSite = isPCMag || url.includes('restricted-domain.com');
    
    // Set up request config with appropriate headers and timeout
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
      },
      // For some problematic feeds, we need to disable strict SSL
      ...(isFeedburner || isRestrictedSite ? { httpsAgent: new require('https').Agent({ rejectUnauthorized: false }) } : {})
    };
    
    // Log for easier debugging
    console.log(`Using specialized headers: ${isRestrictedSite ? 'Yes' : 'No'}`);
    
    // Make the request
    const response = await axios.get(url, requestConfig);
    
    console.log(`Received response from ${url}, status: ${response.status}`);
    
    // Check if we got XML data
    if (!response.data || typeof response.data !== 'string') {
      console.error('Invalid response data:', response.data ? typeof response.data : 'empty');
      throw new Error('Invalid feed data received');
    }
    
    // Parse the XML feed data with error handling
    console.log('Parsing feed data...');
    let feed;
    
    try {
      feed = await parser.parseString(response.data);
      console.log('Feed parsed successfully');
    } catch (parseError) {
      console.error('RSS parsing failed, attempting fallback parsing:', parseError.message);
      
      // Fallback for problematic feeds - create a minimal feed structure
      try {
        // Try to extract title from the XML using regex as a last resort
        const titleMatch = response.data.match(/<title>([^<]+)<\/title>/);
        const title = titleMatch ? titleMatch[1] : url;
        
        // Try to extract items
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
        throw new Error(`Failed to parse RSS feed: ${parseError.message}`);
      }
    }
    
    // Ensure the feed has minimum required structure
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
    console.log(`Sending feed to client with ${feed.items ? feed.items.length : 0} items`);
    res.json(feed);
  } catch (error) {
    console.error(`Error fetching RSS feed from ${url}:`, error);
    res.status(500).json({ 
      error: 'Failed to fetch RSS feed', 
      message: error.message,
      url: url
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`RSS proxy server running at http://localhost:${port}`);
});
