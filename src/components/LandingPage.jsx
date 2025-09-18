import React from 'react';

const LandingPage = ({ totalLessons, onLessonSelect }) => {
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

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-lexik-blue text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Structured Learning</h3>
            <p className="text-gray-600">Organized lessons with clear progression to build your vocabulary systematically.</p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-lexik-blue text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Bilingual Support</h3>
            <p className="text-gray-600">Learn with both English and Persian translations for better understanding.</p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-lexik-blue text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress Tracking</h3>
            <p className="text-gray-600">Track your learning journey with visual progress indicators and lesson completion.</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-6">
            Ready to start your vocabulary journey?
          </p>
          <div className="flex justify-center space-x-4">
            <button className="px-8 py-3 bg-lexik-blue text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200">
              Start with Lesson 1
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
