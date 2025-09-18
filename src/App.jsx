import React, { useState } from 'react';
import WordCard from './components/WordCard';
import { wordsData } from './data/wordsData';

function App() {
  const [currentDay, setCurrentDay] = useState(0);
  const currentWords = wordsData[currentDay];

  const handleNextDay = () => {
    setCurrentDay((prevDay) => (prevDay + 1) % wordsData.length);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="gradient-bg text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            LexiK3
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            Learn 6 new words every day.
          </p>
          <div className="mt-4 text-sm opacity-75">
            Day {currentDay + 1} of {wordsData.length}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Words Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 auto-rows-fr">
            {currentWords.map((wordData, index) => (
              <WordCard
                key={`${currentDay}-${index}`}
                word={wordData.word}
                definition={wordData.definition}
                synonyms={wordData.synonyms}
                examples={wordData.examples}
                persian={wordData.persian}
              />
            ))}
          </div>

          {/* Next Day Button */}
          <div className="text-center">
            <button
              onClick={handleNextDay}
              className="bg-lexik-blue hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Next Day
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-gray-400">
            © 2024 LexiK3. All rights reserved. Expand your vocabulary, one day at a time.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
