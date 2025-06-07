import styled from 'styled-components';
import { motion } from 'framer-motion';

export const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
`;

export const Header = styled.header`
  margin-bottom: 2rem;
  text-align: center;
`;

export const Title = styled.h1`
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
`;

export const Subtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
`;

export const FeedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

export const FeedCard = styled(motion.div)`
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
`;

export const CardImage = styled.div`
  height: 200px;
  background-image: url(${props => props.src || 'https://via.placeholder.com/300x200'});
  background-size: cover;
  background-position: center;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
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
  color: #333;
`;

export const CardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.85rem;
  color: #777;
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
  color: #555;
  font-size: 0.9rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;

export const ModalHeader = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  color: #333;
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
  color: #555;
  
  &:hover {
    background: #f5f5f5;
  }
`;

export const ModalBody = styled.div`
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
  line-height: 1.6;
  color: #333;
  
  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 1rem 0;
  }
  
  a {
    color: #0066cc;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const ModalFooter = styled.div`
  padding: 1rem 2rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SourceLink = styled.a`
  color: #0066cc;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
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
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
`;

export const ErrorContainer = styled.div`
  padding: 2rem;
  background: #fff3f3;
  border: 1px solid #ffcdd2;
  border-radius: 8px;
  color: #d32f2f;
  margin: 2rem 0;
  text-align: center;
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
  background: ${props => props.$active ? '#0066cc' : '#f0f0f0'};
  color: ${props => props.$active ? 'white' : '#333'};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.$active ? '#0055aa' : '#e0e0e0'};
  }
`;

export const RefreshButton = styled.button`
  background: #f0f0f0;
  color: #333;
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
    background: #e0e0e0;
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
  color: #777;
  margin-left: 1rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;
