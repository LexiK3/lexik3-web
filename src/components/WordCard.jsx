import React, { useState } from 'react';
import ClickableText from './ClickableText';

const WordCard = ({ word, exactMeaning, definition, synonyms, examples = [], persian = null, onWordClick }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPersian, setIsPersian] = useState(false);

  const handleFlip = (e) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const handleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleLanguageToggle = (e) => {
    e.stopPropagation();
    if (persian) {
      setIsPersian(!isPersian);
    }
  };

  const handleWordClick = (e) => {
    e.stopPropagation();
    if (onWordClick) {
      onWordClick(currentContent.word);
    }
  };

  // Get current language content
  const currentContent = isPersian && persian ? {
    word: persian.word,
    exactMeaning: persian.exactMeaning,
    definition: persian.definition,
    synonyms: persian.synonyms,
    examples: persian.examples
  } : {
    word,
    exactMeaning,
    definition,
    synonyms,
    examples
  };

  return (
    <div className="word-card">
      <div 
        className={`flip-card-inner ${isFlipped ? 'flipped' : ''} cursor-pointer`}
        onClick={handleFlip}
      >
        {/* Front of card - Word only */}
        <div className="flip-card-front p-6 h-full flex flex-col justify-center items-center text-center">
          <div className="relative group">
            <h3 
              className={`text-3xl font-bold text-gray-900 mb-4 cursor-pointer hover:text-lexik-blue transition-colors duration-200 ${isPersian ? 'font-serif' : ''}`}
              onClick={handleWordClick}
              title="Click to translate in Google Translate"
            >
              {currentContent.word}
            </h3>
            {/* Hover tooltip */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              Translate in Google
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            Click to reveal meaning
          </p>
          <div className="mt-4 text-gray-400">
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-.94-2.688M8.05 19.95l.94 2.688M18.864 7.965l2.898.777M20.812 2.239l-.777 2.897" />
            </svg>
          </div>
        </div>

        {/* Back of card - Definition and synonyms */}
        <div className={`flip-card-back p-6 h-full flex flex-col ${isPersian ? 'text-right' : 'text-left'}`}>
          <div className="relative group mb-4">
            <h3 
              className={`text-2xl font-bold text-gray-900 text-center cursor-pointer hover:text-lexik-blue transition-colors duration-200 ${isPersian ? 'font-serif' : ''}`}
              onClick={handleWordClick}
              title="Click to translate in Google Translate"
            >
              {currentContent.word}
            </h3>
            {/* Hover tooltip */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              Translate in Google
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
            </div>
          </div>
          
          <div className="flex-grow">
            {/* Exact Meaning - 504 Format */}
            {currentContent.exactMeaning && (
              <>
                <h4 className="text-sm font-semibold text-lexik-blue mb-2 uppercase tracking-wide">
                  Exact Meaning
                </h4>
                <p className={`text-gray-800 text-sm leading-relaxed mb-4 font-medium ${isPersian ? 'font-serif' : ''}`}>
                  <ClickableText text={currentContent.exactMeaning} onWordClick={onWordClick} />
                </p>
              </>
            )}
            
            <h4 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
              Definition
            </h4>
            <p className={`text-gray-700 text-sm leading-relaxed mb-4 ${isPersian ? 'font-serif' : ''}`}>
              <ClickableText text={currentContent.definition} onWordClick={onWordClick} />
            </p>
            
            <h4 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
              Synonyms
            </h4>
            <p className={`text-sm text-gray-600 italic mb-4 ${isPersian ? 'font-serif' : ''}`}>
              <ClickableText text={currentContent.synonyms} onWordClick={onWordClick} />
            </p>

            {/* Examples section */}
            {currentContent.examples.length > 0 && (
              <div className="mb-4">
                <button
                  onClick={handleExpand}
                  className="flex items-center text-sm font-semibold text-lexik-blue hover:text-blue-600 transition-colors duration-200 mb-2"
                >
                  <span className="uppercase tracking-wide">Examples</span>
                  <svg 
                    className={`w-4 h-4 ml-1 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <div className={`transition-all duration-300 ${isExpanded ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                  <div className="space-y-2 pb-2">
                    {currentContent.examples.map((example, index) => (
                      <p key={index} className={`text-sm text-gray-600 italic pl-2 border-l-2 border-lexik-blue leading-relaxed ${isPersian ? 'font-serif' : ''}`}>
                        "<ClickableText text={example} onWordClick={onWordClick} />"
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-auto flex justify-center">
            {persian ? (
              <button
                onClick={handleLanguageToggle}
                className="flex items-center space-x-2 px-4 py-2 bg-lexik-blue hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span>{isPersian ? 'English' : 'فارسی'}</span>
              </button>
            ) : (
              <p className="text-xs text-gray-500 text-center">
                Click to flip back
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordCard;
