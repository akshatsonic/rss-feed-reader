import React, { createContext, useState, useEffect, useContext } from 'react';
import { defaultDisplayOptions } from '../config/appConfig';

// Create context with default light theme
export const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
});

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Check if user previously selected dark mode, otherwise use default from config
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    // If theme is explicitly saved, use that; otherwise use the default setting
    return savedTheme ? savedTheme === 'dark' : defaultDisplayOptions.darkModeEnabled;
  });

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Save theme preference to localStorage
  useEffect(() => {
    const theme = isDarkMode ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    
    // Apply theme class to body
    document.body.dataset.theme = theme;
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using theme
export const useTheme = () => useContext(ThemeContext);
