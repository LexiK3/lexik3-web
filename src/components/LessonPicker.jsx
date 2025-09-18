import React, { useState } from 'react';

const LessonPicker = ({ selectedLesson, selectedPart, onLessonChange, totalLessons, isOpen, onClose }) => {
  const getLessonNumber = (lessonIndex) => {
    return lessonIndex + 1;
  };

  const handleLessonSelect = (lessonIndex, part) => {
    onLessonChange(lessonIndex, part);
    onClose();
  };

  return (
    <>

      {/* Lesson Grid Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
           <div 
             className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
             onClick={onClose}
           >
            {/* Modal */}
            <div 
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-lexik-blue to-blue-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    <h3 className="text-xl font-semibold">Choose Your Lesson</h3>
                    <p className="text-blue-100 text-sm">Select any lesson to continue learning</p>
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
              <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {Array.from({ length: totalLessons }, (_, lessonIndex) => (
                    <div key={lessonIndex} className="group">
                      {/* Lesson Card */}
                      <div className={`relative rounded-xl p-4 transition-all duration-300 cursor-pointer ${
                        selectedLesson === lessonIndex 
                          ? 'bg-gradient-to-br from-lexik-blue to-blue-600 text-white shadow-lg scale-105' 
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 hover:border-lexik-blue hover:shadow-md'
                      }`}
                       onClick={onClose}
                      >
                        {/* Lesson Number */}
                        <div className="text-center mb-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-2 transition-all duration-300 ${
                            selectedLesson === lessonIndex
                              ? 'bg-white text-lexik-blue shadow-md'
                              : 'bg-lexik-blue text-white group-hover:bg-blue-600'
                          }`}>
                            {getLessonNumber(lessonIndex)}
                          </div>
                          <div className={`text-sm font-medium ${
                            selectedLesson === lessonIndex ? 'text-white' : 'text-gray-700'
                          }`}>
                            Lesson {getLessonNumber(lessonIndex)}
                          </div>
                        </div>
                        
                        {/* Part Indicators */}
                        <div className="space-y-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLessonSelect(lessonIndex, 1);
                            }}
                            className={`w-full py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 ${
                              selectedLesson === lessonIndex && selectedPart === 1
                                ? 'bg-white text-lexik-blue shadow-sm'
                                : selectedLesson === lessonIndex
                                ? 'bg-white/20 text-white hover:bg-white/30'
                                : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-300'
                            }`}
                          >
                            Part 1
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLessonSelect(lessonIndex, 2);
                            }}
                            className={`w-full py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 ${
                              selectedLesson === lessonIndex && selectedPart === 2
                                ? 'bg-white text-lexik-blue shadow-sm'
                                : selectedLesson === lessonIndex
                                ? 'bg-white/20 text-white hover:bg-white/30'
                                : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-300'
                            }`}
                          >
                            Part 2
                          </button>
                        </div>

                        {/* Selection Indicator */}
                        {selectedLesson === lessonIndex && (
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
            </div>
          </div>
         </>
       )}
    </>
  );
};

export default LessonPicker;
