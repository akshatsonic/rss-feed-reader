import styled, { createGlobalStyle } from 'styled-components';
import { motion } from 'framer-motion';

// Global styles for theme switching
export const GlobalStyle = createGlobalStyle`
  body {
    transition: background-color 0.3s ease, color 0.3s ease;
    background-color: ${props => props.theme.isDarkMode ? '#121212' : '#f5f5f5'};
    color: ${props => props.theme.isDarkMode ? '#e1e1e1' : '#333'};
  }
`;

export const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  transition: background-color 0.3s ease, color 0.3s ease;
`;

export const Header = styled.header`
  margin-bottom: 2rem;
  text-align: center;
`;

export const Title = styled.h1`
  color: ${props => props.theme.isDarkMode ? '#f0f0f0' : '#333'};
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
`;

export const Subtitle = styled.p`
  color: ${props => props.theme.isDarkMode ? '#b0b0b0' : '#666'};
  font-size: 1.1rem;
  transition: color 0.3s ease;
`;

export const FeedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

export const FeedCard = styled(motion.div)`
  background: ${props => props.theme.isDarkMode ? '#2d2d3a' : '#fff'};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${props => props.theme.isDarkMode ? '0 4px 15px rgba(0, 0, 0, 0.4)' : '0 4px 15px rgba(0, 0, 0, 0.1)'};
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.3s ease;
  border: ${props => props.theme.isDarkMode ? '1px solid #383854' : 'none'};
  
  &:hover {
    box-shadow: ${props => props.theme.isDarkMode ? '0 8px 30px rgba(0, 0, 0, 0.5)' : '0 8px 30px rgba(0, 0, 0, 0.15)'};
    transform: translateY(-5px);
  }
`;

export const CardImage = styled.div`
  height: 200px;
  background-color: ${props => props.theme?.isDarkMode ? '#242430' : '#f0f0f0'};
  background-image: ${props => props.src ? `url(${props.src})` : 'none'};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  position: relative;
  overflow: hidden;

  .missing-image-indicator {
    position: absolute;
    top: 10px;
    right: 10px;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: help;
    z-index: 5;
    transition: all 0.2s ease;
    
    &:hover {
      transform: scale(1.1);
    }
  }
  
  .missing-image-tooltip {
    position: absolute;
    top: 40px;
    right: 0px;
    padding: 8px 12px;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    font-size: 12px;
    white-space: nowrap;
    z-index: 10;
  }
`;

export const CardContent = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const CardTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.isDarkMode ? '#f0f0f0' : '#333'};
  transition: color 0.3s ease;
`;

export const CardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.85rem;
  color: ${props => props.theme.isDarkMode ? '#a0a0a0' : '#777'};
  transition: color 0.3s ease;
`;

export const CardDate = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const CardSource = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 500;
`;

export const CardExcerpt = styled.p`
  margin: 0;
  color: ${props => props.theme.isDarkMode ? '#c0c0c0' : '#555'};
  font-size: 0.9rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s ease;
`;

export const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  padding: 2rem;
`;

export const Modal = styled(motion.div)`
  background: ${props => props.theme.isDarkMode ? '#2d2d3a' : 'white'};
  border-radius: 16px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  transition: background-color 0.3s ease;
  border: ${props => props.theme.isDarkMode ? '1px solid #383854' : 'none'};
  box-shadow: ${props => props.theme.isDarkMode ? '0 4px 30px rgba(0, 0, 0, 0.5)' : '0 4px 30px rgba(0, 0, 0, 0.2)'};
`;

export const ModalHeader = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid ${props => props.theme.isDarkMode ? '#3a3a3a' : '#eee'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: border-color 0.3s ease;
`;

export const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  color: ${props => props.theme.isDarkMode ? '#f0f0f0' : '#333'};
  transition: color 0.3s ease;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${props => props.theme.isDarkMode ? '#b0b0b0' : '#555'};
  transition: background-color 0.3s ease, color 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.isDarkMode ? '#3a3a3a' : '#f5f5f5'};
  }
`;

export const ModalBody = styled.div`
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
  line-height: 1.6;
  color: ${props => props.theme.isDarkMode ? '#e1e1e1' : '#333'};
  transition: color 0.3s ease;
  
  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 1rem 0;
  }
  
  a {
    color: ${props => props.theme.isDarkMode ? '#66b2ff' : '#0066cc'};
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const ModalFooter = styled.div`
  padding: 1rem 2rem;
  border-top: 1px solid ${props => props.theme.isDarkMode ? '#3a3a3a' : '#eee'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: border-color 0.3s ease;
`;

export const SourceLink = styled.a`
  color: ${props => props.theme.isDarkMode ? '#66b2ff' : '#0066cc'};
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s ease;
  
  &:hover {
    text-decoration: underline;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
`;

export const Spinner = styled(motion.div)`
  width: 40px;
  height: 40px;
  border: 4px solid ${props => props.theme.isDarkMode ? '#3a3a3a' : '#f3f3f3'};
  border-top: 4px solid ${props => props.theme.isDarkMode ? '#66b2ff' : '#3498db'};
  border-radius: 50%;
  transition: border-color 0.3s ease;
`;

export const ErrorContainer = styled.div`
  padding: 2rem;
  background: ${props => props.theme.isDarkMode ? '#3a2828' : '#fff3f3'};
  border: 1px solid ${props => props.theme.isDarkMode ? '#5c2b2b' : '#ffcdd2'};
  border-radius: 8px;
  color: ${props => props.theme.isDarkMode ? '#ff6b6b' : '#d32f2f'};
  margin: 2rem 0;
  text-align: center;
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
`;

export const FeedSelector = styled.div`
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const FeedButton = styled.button`
  background: ${props => {
    if (props.$active) {
      return props.theme.isDarkMode ? '#0077e6' : '#0066cc';
    }
    return props.theme.isDarkMode ? '#3a3a3a' : '#f0f0f0';
  }};
  color: ${props => {
    if (props.$active) {
      return 'white';
    }
    return props.theme.isDarkMode ? '#e1e1e1' : '#333';
  }};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  
  /* Fix for vertical alignment */
  img, svg {
    display: block;
    vertical-align: middle;
  }
  
  &:hover {
    background: ${props => {
      if (props.$active) {
        return props.theme.isDarkMode ? '#0066cc' : '#0055aa';
      }
      return props.theme.isDarkMode ? '#444444' : '#e0e0e0';
    }};
  }
`;

export const RefreshButton = styled.button`
  background: ${props => props.theme.isDarkMode ? '#3a3a3a' : '#f0f0f0'};
  color: ${props => props.theme.isDarkMode ? '#e1e1e1' : '#333'};
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 1rem;
  
  &:hover {
    background: ${props => props.theme.isDarkMode ? '#444444' : '#e0e0e0'};
    transform: rotate(30deg);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      transform: none;
    }
  }
`;

export const LastUpdateText = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.isDarkMode ? '#a0a0a0' : '#777'};
  margin-left: 1rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: color 0.3s ease;
`;
