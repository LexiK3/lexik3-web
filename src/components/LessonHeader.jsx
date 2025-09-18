import React from 'react';

const LessonHeader = ({ selectedLesson, selectedPart, onLessonChange, onBrowseAll, totalLessons }) => {
  const getLessonNumber = (lessonIndex) => {
    return lessonIndex + 1;
  };

  return (
    <div className="flex items-center justify-between">
      {/* Current Lesson Info */}
      <div className="text-white">
        <h2 className="text-4xl md:text-5xl font-bold mb-2">
          LexiK3
        </h2>
        <p className="text-lg md:text-xl opacity-90">
          Learn 6 new words every day.
        </p>
        <div className="mt-4 text-sm opacity-75">
          Lesson {getLessonNumber(selectedLesson)} - Part {selectedPart}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-end space-y-4">
        {/* Browse All Lessons Icon */}
        <button
          onClick={onBrowseAll}
          className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
          title="Browse All Lessons"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </button>

        {/* Part Selector */}
        <div className="flex space-x-2">
          <button
            onClick={() => onLessonChange(selectedLesson, 1)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              selectedPart === 1
                ? 'bg-white text-lexik-blue shadow-md'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Part 1
          </button>
          <button
            onClick={() => onLessonChange(selectedLesson, 2)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              selectedPart === 2
                ? 'bg-white text-lexik-blue shadow-md'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Part 2
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonHeader;
