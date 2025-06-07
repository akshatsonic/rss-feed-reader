import React, { useState } from 'react';
import { FaRss } from 'react-icons/fa';
import styled from 'styled-components';

const LogoImage = styled.img`
  width: ${props => props.size || 20}px;
  height: ${props => props.size || 20}px;
  object-fit: contain;
  margin-right: 0.5rem;
  transition: all 0.3s ease;
  display: block; // Prevent extra space below image
  vertical-align: middle;
`;

const IconContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
  transition: all 0.3s ease;
  line-height: 0; // Remove extra space
`;

/**
 * Component to display a feed source logo or fallback to RSS icon
 * @param {Object} props - Component props
 * @param {string} props.logoUrl - URL to the logo image
 * @param {number} props.size - Size of the logo in pixels
 * @param {string} props.feedId - Feed identifier for styling
 * @param {Object} props.theme - Theme object for styled-components
 * @returns {JSX.Element} - Rendered component
 */
const FeedLogo = ({ logoUrl, size = 20, feedId = '', theme, ...props }) => {
  const [logoLoaded, setLogoLoaded] = useState(true);
  const [logoError, setLogoError] = useState(false);
  
  // Handle logo loading error
  const handleError = () => {
    setLogoError(true);
    setLogoLoaded(false);
  };
  
  // Show fallback RSS icon if no logo URL or if logo failed to load
  if (!logoUrl || logoError) {
    return (
      <IconContainer {...props}>
        <FaRss 
          size={size} 
          color={theme?.isDarkMode ? '#e0e0e0' : '#333'} 
        />
      </IconContainer>
    );
  }
  
  return (
    <LogoImage
      src={logoUrl}
      alt={`${feedId} logo`}
      size={size}
      onError={handleError}
      {...props}
    />
  );
};

export default FeedLogo;
