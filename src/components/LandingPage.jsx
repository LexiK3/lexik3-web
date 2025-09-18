import React from 'react';

const LandingPage = ({ totalLessons, onLessonSelect, onStartQuiz }) => {
  const getLessonNumber = (lessonIndex) => {
    return lessonIndex + 1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            LexiK3
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-4">
            Expand your vocabulary, one lesson at a time
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Learn 6 new words every day through structured lessons. Each lesson contains two parts with carefully curated vocabulary to enhance your English skills.
          </p>
        </div>

        {/* Lesson Selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-12">
          {Array.from({ length: totalLessons }, (_, lessonIndex) => (
            <div key={lessonIndex} className="group">
              {/* Lesson Card */}
              <div 
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-lexik-blue transform hover:-translate-y-1 h-full flex flex-col"
                onClick={() => onLessonSelect(lessonIndex)}
              >
                {/* Lesson Number */}
                <div className="text-center flex-1 flex flex-col justify-between">
                  <div>
                    <div className="w-16 h-16 bg-gradient-to-br from-lexik-blue to-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      {getLessonNumber(lessonIndex)}
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2 whitespace-nowrap">
                      Lesson {getLessonNumber(lessonIndex)}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      12 new words
                    </p>
                  </div>
                  
                  {/* Part Indicators */}
                  <div className="space-y-2 mt-auto">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-lexik-blue rounded-full"></div>
                      <span className="text-xs text-gray-600">Part 1</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-lexik-blue rounded-full"></div>
                      <span className="text-xs text-gray-600">Part 2</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>


        {/* Call to Action */}
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-6">
            Ready to start your vocabulary journey?
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => onLessonSelect(0)}
              className="px-8 py-3 bg-lexik-blue text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200"
            >
              Start with Lesson 1
            </button>
            <button 
              onClick={onStartQuiz}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2"
            >
              <span>🧠</span>
              <span>Take Quiz</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
