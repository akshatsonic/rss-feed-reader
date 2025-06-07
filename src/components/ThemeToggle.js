import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

const ToggleButton = styled(motion.button)`
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: ${({ $isDarkMode }) => ($isDarkMode ? '#fff' : '#333')};
  padding: 8px;
  border-radius: 50%;
  margin-left: auto;
  
  &:hover {
    background: ${({ $isDarkMode }) => ($isDarkMode ? '#444' : '#eee')};
  }
`;

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <ToggleButton
      onClick={toggleTheme}
      $isDarkMode={isDarkMode}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
    >
      {isDarkMode ? <FaSun /> : <FaMoon />}
    </ToggleButton>
  );
};

export default ThemeToggle;
