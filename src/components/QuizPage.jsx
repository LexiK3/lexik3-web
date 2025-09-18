import React, { useState, useEffect } from 'react';
import { quizTypes, quizTypeInfo } from '../data/quizData';
import QuizReview from './QuizReview';

const QuizPage = ({ 
  questions, 
  quizType, 
  selectedLessons, 
  onBackToLanding, 
  onRetakeQuiz 
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes per quiz
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !quizCompleted) {
      handleSubmitQuiz();
    }
  }, [timeLeft, quizCompleted]);

  const handleAnswerSelect = (answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setQuizCompleted(true);
    setShowResult(true);
    setShowReview(true);
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    questions.forEach(question => {
      const userAnswer = userAnswers[question.id];
      if (userAnswer === question.correctAnswer) {
        correctAnswers++;
      }
    });
    return {
      correct: correctAnswers,
      total: totalQuestions,
      percentage: Math.round((correctAnswers / totalQuestions) * 100)
    };
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case quizTypes.DEFINITION_MATCH:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              {currentQuestion.question}
            </h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-lg text-gray-700 mb-4">{currentQuestion.definition}</p>
              <div className="space-y-3">
                {currentQuestion.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    className={`w-full p-3 text-left rounded-lg border-2 transition-all duration-200 ${
                      userAnswers[currentQuestion.id] === option
                        ? 'border-lexik-blue bg-blue-50 text-lexik-blue'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case quizTypes.SYNONYM_MATCH:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              {currentQuestion.question}
            </h3>
            <div className="space-y-3">
              {currentQuestion.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    userAnswers[currentQuestion.id] === option
                      ? 'border-lexik-blue bg-blue-50 text-lexik-blue'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );

      case quizTypes.EXAMPLE_COMPLETION:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              {currentQuestion.question}
            </h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-lg text-gray-700 mb-4">{currentQuestion.example}</p>
              <div className="space-y-3">
                {currentQuestion.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    className={`w-full p-3 text-left rounded-lg border-2 transition-all duration-200 ${
                      userAnswers[currentQuestion.id] === option
                        ? 'border-lexik-blue bg-blue-50 text-lexik-blue'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case quizTypes.TRANSLATION:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              {currentQuestion.question}
            </h3>
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <p className="text-2xl font-bold text-gray-800 mb-4">{currentQuestion.persianWord}</p>
              <div className="space-y-3">
                {currentQuestion.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    className={`w-full p-3 text-left rounded-lg border-2 transition-all duration-200 ${
                      userAnswers[currentQuestion.id] === option
                        ? 'border-lexik-blue bg-blue-50 text-lexik-blue'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return <div>Unknown question type</div>;
    }
  };


  if (showReview) {
    return (
      <QuizReview
        questions={questions}
        userAnswers={userAnswers}
        score={calculateScore()}
        onRetakeQuiz={onRetakeQuiz}
        onBackToLanding={onBackToLanding}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="gradient-bg text-white py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBackToLanding}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">Back to Lessons</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="font-semibold">Time Left:</span> {formatTime(timeLeft)}
              </div>
              <div className="text-sm">
                <span className="font-semibold">Question:</span> {currentQuestionIndex + 1} of {totalQuestions}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Quiz Type Info */}
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-2xl">{quizTypeInfo[quizType]?.icon}</span>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {quizTypeInfo[quizType]?.name}
                </h2>
                <p className="text-sm text-gray-600">
                  Lessons {selectedLessons.map(l => l + 1).join(', ')}
                </p>
              </div>
            </div>

            {/* Question */}
            {renderQuestion()}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                  currentQuestionIndex === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Previous
              </button>

              <div className="flex space-x-2">
                {questions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index === currentQuestionIndex
                        ? 'bg-lexik-blue'
                        : userAnswers[questions[index].id]
                        ? 'bg-green-400'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNextQuestion}
                disabled={!userAnswers[currentQuestion.id]}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                  !userAnswers[currentQuestion.id]
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-lexik-blue text-white hover:bg-blue-600'
                }`}
              >
                {currentQuestionIndex === totalQuestions - 1 ? 'Submit Quiz' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuizPage;
