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
    feed: ['subtitle', 'icon'],
    item: ['media:content', 'enclosure', 'content:encoded', 'content']
  },
  defaultRSS: 2.0
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
    
    // Set up request config with appropriate headers and timeout
    const requestConfig = {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
      },
      // For some problematic feeds, we need to disable strict SSL
      ...(isFeedburner ? { httpsAgent: new require('https').Agent({ rejectUnauthorized: false }) } : {})
    };
    
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
