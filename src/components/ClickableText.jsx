import React from 'react';
import ClickableWord from './ClickableWord';

const ClickableText = ({ text, className = "", onWordClick }) => {
  // Split text into words and spaces, preserving all whitespace
  const parts = text.split(/(\s+)/);
  
  return (
    <span className={className}>
      {parts.map((part, index) => {
        // Handle whitespace - preserve as is
        if (/^\s+$/.test(part)) {
          return <span key={index}>{part}</span>;
        }
        
        // Clean word for translation (remove punctuation)
        const cleanWord = part.replace(/[^\w\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g, '');
        
        // If it's just punctuation or empty, return as is
        if (!cleanWord) {
          return <span key={index}>{part}</span>;
        }
        
        return (
          <ClickableWord 
            key={index} 
            word={cleanWord}
            className="hover:underline"
            onWordClick={onWordClick}
          />
        );
      })}
    </span>
  );
};

export default ClickableText;
