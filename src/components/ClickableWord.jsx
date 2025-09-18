import React from 'react';

const ClickableWord = ({ word, className = "", onWordClick }) => {
  const handleWordClick = (e) => {
    e.stopPropagation();
    if (onWordClick) {
      onWordClick(word);
    }
  };

  return (
    <span 
      className={`cursor-pointer hover:text-lexik-blue transition-colors duration-200 ${className}`}
      onClick={handleWordClick}
      title="Click to translate in Google Translate"
    >
      {word}
    </span>
  );
};

export default ClickableWord;
