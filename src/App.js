import React from 'react';
import FeedContainer from './components/FeedContainer';
import ErrorLogger from './components/ErrorLogger';
import ThemeToggle from './components/ThemeToggle';
import { useTheme } from './contexts/ThemeContext';
import { AppContainer, Header, Title, Subtitle, GlobalStyle } from './styles/StyledComponents';

function App() {
  // You can add your custom RSS feeds here
  const customFeeds = [
    // Add your custom feed URLs here
    // 'https://example.com/rss.xml',
  ];

  const { isDarkMode } = useTheme();

  return (
    <>
      <GlobalStyle theme={{ isDarkMode }} />
      <AppContainer theme={{ isDarkMode }}>
        <Header>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Title theme={{ isDarkMode }}>RSS Feed Reader</Title>
              <Subtitle theme={{ isDarkMode }}>Stay updated with your favorite content in one place</Subtitle>
            </div>
            <ThemeToggle />
          </div>
        </Header>
        
        <FeedContainer customFeeds={customFeeds} />
        <ErrorLogger />
      </AppContainer>
    </>
  );
}

export default App;
