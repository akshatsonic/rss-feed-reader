import React from 'react';
import FeedContainer from './components/FeedContainer';
import ErrorLogger from './components/ErrorLogger';
import ThemeToggle from './components/ThemeToggle';
import { useTheme } from './contexts/ThemeContext';
import { AppContainer, Header, Title, Subtitle, GlobalStyle } from './styles/StyledComponents';
import { defaultDisplayOptions } from './config/appConfig';

function App() {
  // Custom feeds can be added here - these will be merged with configured feeds
  const customFeeds = [
    // Add your personal feed URLs here
    // 'https://example.com/rss.xml',
  ];

  // Get dark mode preference from theme context
  const { isDarkMode } = useTheme();
  
  // Initialize app with configured default settings
  const initialDarkMode = defaultDisplayOptions.darkModeEnabled;

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
