import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoOpenOutline } from 'react-icons/io5';
import { format, parseISO } from 'date-fns';

import {
  Overlay,
  Modal,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  ModalFooter,
  SourceLink
} from '../styles/StyledComponents';

/**
 * Modal component for displaying full article content
 */
const ArticleModal = ({ isOpen, onClose, article }) => {
  if (!article) return null;
  
  // Format publication date with error handling for different date formats
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    try {
      // Try parsing as ISO format first
      return format(parseISO(dateString), 'MMMM d, yyyy');
    } catch (error) {
      try {
        // Try parsing as a regular date string
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
          return format(date, 'MMMM d, yyyy');
        }
      } catch (e) {
        console.error('Failed to parse date:', dateString, e);
      }
      
      // If all parsing fails, just return the date string or unknown
      return dateString || 'Unknown date';
    }
  };
  
  const formattedDate = formatDate(article.pubDate);

  // Animation variants for the modal
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.2,
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: 0.2,
        delay: 0.1
      }
    }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.95,
      y: 20
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <Modal
            variants={modalVariants}
            layoutId={`card-container-${article.id}`}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle $layoutId={`card-title-${article.id}`}>
                {article.title}
              </ModalTitle>
              <CloseButton onClick={onClose}>
                <IoClose />
              </CloseButton>
            </ModalHeader>
            
            {article.thumbnail && (
              <motion.div layoutId={`card-image-${article.id}`}>
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  style={{ 
                    width: '100%', 
                    maxHeight: '400px', 
                    objectFit: 'cover' 
                  }}
                />
              </motion.div>
            )}
            
            <ModalBody dangerouslySetInnerHTML={{ __html: article.content }} />
            
            <ModalFooter>
              <div>
                <p>Published: {formattedDate}</p>
                {article.author && <p>Author: {article.author}</p>}
              </div>
              <SourceLink href={article.link} target="_blank" rel="noopener noreferrer">
                Read original article <IoOpenOutline />
              </SourceLink>
            </ModalFooter>
          </Modal>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default ArticleModal;
