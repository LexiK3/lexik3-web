import React, { useState } from 'react';
import { quizTypes, quizTypeInfo } from '../data/quizData';

const QuizPicker = ({ totalLessons, isOpen, onClose, onStartQuiz }) => {
  const [selectedLessons, setSelectedLessons] = useState([]);
  const [selectedQuizType, setSelectedQuizType] = useState(quizTypes.DEFINITION_MATCH);

  const handleLessonToggle = (lessonIndex) => {
    setSelectedLessons(prev => {
      if (prev.includes(lessonIndex)) {
        return prev.filter(lesson => lesson !== lessonIndex);
      } else {
        return [...prev, lessonIndex];
      }
    });
  };

  const handleStartQuiz = () => {
    if (selectedLessons.length === 0) {
      alert('Please select at least one lesson for the quiz.');
      return;
    }
    onStartQuiz(selectedLessons, selectedQuizType);
  };

  const getLessonNumber = (lessonIndex) => {
    return lessonIndex + 1;
  };

  const isLessonSelected = (lessonIndex) => {
    return selectedLessons.includes(lessonIndex);
  };

  return (
    <>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal */}
            <div 
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-lexik-blue to-blue-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    <h3 className="text-xl font-semibold">Create Your Quiz</h3>
                    <p className="text-blue-100 text-sm">Select lessons and quiz type to start</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {/* Quiz Type Selection */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Choose Quiz Type</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(quizTypeInfo).map(([type, info]) => (
                      <div
                        key={type}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          selectedQuizType === type
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                        onClick={() => setSelectedQuizType(type)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{info.icon}</div>
                          <div>
                            <h5 className="font-semibold text-gray-900">{info.name}</h5>
                            <p className="text-sm text-gray-600">{info.description}</p>
                          </div>
                        </div>
                        {selectedQuizType === type && (
                          <div className="mt-2 flex items-center text-green-600">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm font-medium">Selected</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lesson Selection */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Select Lessons ({selectedLessons.length} selected)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {Array.from({ length: totalLessons }, (_, lessonIndex) => (
                      <div key={lessonIndex} className="group">
                        <div
                          className={`relative rounded-xl p-4 transition-all duration-300 cursor-pointer ${
                            isLessonSelected(lessonIndex)
                              ? 'bg-gradient-to-br from-lexik-blue to-blue-600 text-white shadow-lg scale-105'
                              : 'bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 hover:border-lexik-blue hover:shadow-md'
                          }`}
                          onClick={() => handleLessonToggle(lessonIndex)}
                        >
                          {/* Lesson Number */}
                          <div className="text-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-2 transition-all duration-300 ${
                              isLessonSelected(lessonIndex)
                                ? 'bg-white text-lexik-blue shadow-md'
                                : 'bg-lexik-blue text-white group-hover:bg-blue-600'
                            }`}>
                              {getLessonNumber(lessonIndex)}
                            </div>
                            <div className={`text-sm font-medium ${
                              isLessonSelected(lessonIndex) ? 'text-white' : 'text-gray-700'
                            }`}>
                              Lesson {getLessonNumber(lessonIndex)}
                            </div>
                          </div>

                          {/* Selection Indicator */}
                          {isLessonSelected(lessonIndex) && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStartQuiz}
                    disabled={selectedLessons.length === 0}
                    className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                      selectedLessons.length === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-lexik-blue text-white hover:bg-blue-600'
                    }`}
                  >
                    Start Quiz ({selectedLessons.length} lessons)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default QuizPicker;