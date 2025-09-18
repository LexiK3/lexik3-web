import React from 'react';

const LessonNavigation = ({ selectedLesson, selectedPart, onLessonChange, totalLessons }) => {
  const getLessonNumber = (lessonIndex) => {
    return lessonIndex + 1;
  };

  const navigateLesson = (direction) => {
    let newLesson = selectedLesson;
    let newPart = selectedPart;
    
    if (direction === 1) {
      // Move forward
      if (selectedPart === 1) {
        newPart = 2;
      } else {
        newLesson = selectedLesson + 1;
        newPart = 1;
      }
    } else {
      // Move backward
      if (selectedPart === 2) {
        newPart = 1;
      } else {
        newLesson = selectedLesson - 1;
        newPart = 2;
      }
    }
    
    if (newLesson >= 0 && newLesson < totalLessons) {
      onLessonChange(newLesson, newPart);
    }
  };

  return (
    <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-4">
      {/* Previous Button */}
      <button
        onClick={() => navigateLesson(-1)}
        className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={selectedLesson === 0 && selectedPart === 1}
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="font-medium text-gray-700">Previous</span>
      </button>

      {/* Lesson Progress Indicator */}
      <div className="flex items-center space-x-2">
        {Array.from({ length: totalLessons }, (_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-colors duration-200 ${
              index <= selectedLesson ? 'bg-lexik-blue' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Lesson Info */}
      <div className="text-center">
        <div className="text-sm text-gray-500">
          Lesson {getLessonNumber(selectedLesson)} of {totalLessons}
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={() => navigateLesson(1)}
        className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={selectedLesson === totalLessons - 1 && selectedPart === 2}
      >
        <span className="font-medium text-gray-700">Next</span>
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default LessonNavigation;
