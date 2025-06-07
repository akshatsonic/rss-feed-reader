import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ErrorPanel = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  max-width: 500px;
  background-color: rgba(220, 53, 69, 0.95);
  color: white;
  padding: 1rem;
  border-top-left-radius: 8px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  max-height: 300px;
  overflow-y: auto;
`;

const ErrorTitle = styled.h4`
  margin-top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
`;

const ErrorMessage = styled.div`
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  font-family: monospace;
  white-space: pre-wrap;
  font-size: 0.9rem;
`;

/**
 * Component to capture and display console errors
 */
const ErrorLogger = () => {
  const [errors, setErrors] = useState([]);
  const [visible, setVisible] = useState(false);

  // Override console.error to capture errors
  useEffect(() => {
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    
    // Store errors in our state
    console.error = (...args) => {
      originalConsoleError.apply(console, args);
      
      const errorMessage = args.map(arg => {
        if (arg instanceof Error) {
          return `${arg.name}: ${arg.message}\n${arg.stack}`;
        } else if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg, null, 2);
          } catch (e) {
            return String(arg);
          }
        } else {
          return String(arg);
        }
      }).join(' ');
      
      setErrors(prev => [...prev, { type: 'error', message: errorMessage }]);
      setVisible(true);
    };
    
    // Also capture warnings
    console.warn = (...args) => {
      originalConsoleWarn.apply(console, args);
      
      const warnMessage = args.map(arg => {
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg, null, 2);
          } catch (e) {
            return String(arg);
          }
        } else {
          return String(arg);
        }
      }).join(' ');
      
      setErrors(prev => [...prev, { type: 'warning', message: warnMessage }]);
      // Don't auto-show for warnings
    };
    
    // Listen for unhandled promise rejections
    const handleUnhandledRejection = (event) => {
      console.error('Unhandled Promise Rejection:', event.reason);
    };
    
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    // Restore original console methods on unmount
    return () => {
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
  
  // Clear all errors
  const clearErrors = () => {
    setErrors([]);
    setVisible(false);
  };

  if (!visible || errors.length === 0) return null;

  return (
    <ErrorPanel>
      <ErrorTitle>
        Console Errors ({errors.length})
        <CloseButton onClick={clearErrors}>×</CloseButton>
      </ErrorTitle>
      <div>
        {errors.slice(-5).map((error, index) => (
          <ErrorMessage key={index}>
            {error.type === 'error' ? '🔴 ' : '⚠️ '}
            {error.message}
          </ErrorMessage>
        ))}
        {errors.length > 5 && (
          <ErrorMessage>
            ... and {errors.length - 5} more errors/warnings
          </ErrorMessage>
        )}
      </div>
    </ErrorPanel>
  );
};

export default ErrorLogger;
