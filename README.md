# RSS Feed Reader

![RSS Feed Reader](https://via.placeholder.com/800x400?text=RSS+Feed+Reader)

A modern, animated RSS feed reader built with React. This application allows you to view RSS feeds from multiple sources with a beautiful, card-based interface and smooth animations.

## Features

- 🌟 Modern, clean UI with animated cards
- 📱 Responsive design that works on all devices
- 🔄 Switch between multiple RSS feeds
- 🖼️ Card layout similar to popular feed interfaces
- 🔍 Modal view for reading full articles
- ⚡ Smooth animations using Framer Motion
- 🔒 Proxy server to bypass CORS issues

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/rss-feed-reader.git
   cd rss-feed-reader
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server and React app
   ```
   npm run dev
   ```
   This will start both the backend proxy server on port 3001 and the React app on port 3000.

4. Open your browser and navigate to http://localhost:3000

## Available Scripts

- `npm start` - Runs just the React frontend
- `npm run start:server` - Runs just the backend proxy server
- `npm run dev` - Runs both the server and frontend concurrently
- `npm run build` - Creates a production build

## How to Add Custom RSS Feeds

To add your own RSS feeds, open `src/App.js` and modify the `customFeeds` array:

```javascript
const customFeeds = [
  'https://example.com/feed.xml',
  'https://another-site.com/rss'
];
```

## Technologies Used

- React
- Framer Motion for animations
- Styled Components for styling
- Express for the proxy server
- RSS Parser for parsing feeds
- Axios for HTTP requests
- date-fns for date formatting

## License

This project is licensed under the MIT License - see the LICENSE file for details.
