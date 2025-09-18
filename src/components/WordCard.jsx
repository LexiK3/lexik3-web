import React, { useState } from 'react';

const WordCard = ({ word, definition, synonyms, examples = [] }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFlip = (e) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const handleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="word-card">
      <div 
        className={`flip-card-inner ${isFlipped ? 'flipped' : ''} cursor-pointer`}
        onClick={handleFlip}
      >
        {/* Front of card - Word only */}
        <div className="flip-card-front p-6 h-full flex flex-col justify-center items-center text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            {word}
          </h3>
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
        <div className="flip-card-back p-6 h-full flex flex-col">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            {word}
          </h3>
          
          <div className="flex-grow">
            <h4 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
              Definition
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              {definition}
            </p>
            
            <h4 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
              Synonyms
            </h4>
            <p className="text-sm text-gray-600 italic mb-4">
              {synonyms}
            </p>

            {/* Examples section */}
            {examples.length > 0 && (
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
                    {examples.map((example, index) => (
                      <p key={index} className="text-sm text-gray-600 italic pl-2 border-l-2 border-lexik-blue leading-relaxed">
                        "{example}"
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-auto">
            <p className="text-xs text-gray-500 text-center">
              Click to flip back
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordCard;
