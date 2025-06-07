import React from 'react';
import FeedContainer from './components/FeedContainer';
import ErrorLogger from './components/ErrorLogger';
import { AppContainer, Header, Title, Subtitle } from './styles/StyledComponents';

function App() {
  // You can add your custom RSS feeds here
  const customFeeds = [
    // Add your custom feed URLs here
    // 'https://example.com/rss.xml',
  ];

  return (
    <AppContainer>
      <Header>
        <Title>RSS Feed Reader</Title>
        <Subtitle>Stay updated with your favorite content in one place</Subtitle>
      </Header>
      
      <FeedContainer customFeeds={customFeeds} />
      <ErrorLogger />
    </AppContainer>
  );
}

export default App;
