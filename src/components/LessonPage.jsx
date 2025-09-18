import React from 'react';
import WordCard from './WordCard';
import LessonHeader from './LessonHeader';
import LessonNavigation from './LessonNavigation';

const LessonPage = ({ 
  currentLesson, 
  currentPart, 
  currentWords, 
  totalLessons,
  onLessonChange, 
  onBrowseAll,
  onWordClick,
  onBackToLanding 
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="gradient-bg text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <div className="mb-4">
            <button
              onClick={onBackToLanding}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">Back to Lessons</span>
            </button>
          </div>
          
          <LessonHeader
            selectedLesson={currentLesson}
            selectedPart={currentPart}
            onLessonChange={onLessonChange}
            onBrowseAll={onBrowseAll}
            totalLessons={totalLessons}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Words Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 auto-rows-fr">
            {currentWords.map((wordData, index) => (
              <WordCard
                key={`${currentLesson}-${currentPart}-${index}`}
                word={wordData.word}
                definition={wordData.definition}
                synonyms={wordData.synonyms}
                examples={wordData.examples}
                persian={wordData.persian}
                onWordClick={onWordClick}
              />
            ))}
          </div>

          {/* Lesson Navigation */}
          <div className="mb-8">
            <LessonNavigation
              selectedLesson={currentLesson}
              selectedPart={currentPart}
              onLessonChange={onLessonChange}
              totalLessons={totalLessons}
            />
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
};

export default LessonPage;
