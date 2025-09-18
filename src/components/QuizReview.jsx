import React from 'react';
import { quizTypes } from '../data/quizData';

const QuizReview = ({ 
  questions, 
  userAnswers, 
  score, 
  onRetakeQuiz, 
  onBackToLanding 
}) => {
  const getQuestionTypeIcon = (type) => {
    switch (type) {
      case quizTypes.DEFINITION_MATCH:
        return '📖';
      case quizTypes.SYNONYM_MATCH:
        return '🔗';
      case quizTypes.EXAMPLE_COMPLETION:
        return '✏️';
      case quizTypes.TRANSLATION:
        return '🌐';
      default:
        return '❓';
    }
  };

  const getQuestionTypeName = (type) => {
    switch (type) {
      case quizTypes.DEFINITION_MATCH:
        return 'Definition Match';
      case quizTypes.SYNONYM_MATCH:
        return 'Synonym Match';
      case quizTypes.EXAMPLE_COMPLETION:
        return 'Example Completion';
      case quizTypes.TRANSLATION:
        return 'Translation';
      default:
        return 'Unknown';
    }
  };

  const isCorrect = (question) => {
    return userAnswers[question.id] === question.correctAnswer;
  };

  const getPerformanceMessage = (percentage) => {
    if (percentage >= 90) return { message: "Outstanding! You're a vocabulary master!", color: "text-green-600", bg: "bg-green-50" };
    if (percentage >= 80) return { message: "Excellent work! You have a strong vocabulary!", color: "text-green-600", bg: "bg-green-50" };
    if (percentage >= 70) return { message: "Good job! You're making great progress!", color: "text-blue-600", bg: "bg-blue-50" };
    if (percentage >= 60) return { message: "Not bad! Keep practicing to improve!", color: "text-yellow-600", bg: "bg-yellow-50" };
    return { message: "Keep learning! Practice makes perfect!", color: "text-red-600", bg: "bg-red-50" };
  };

  const performance = getPerformanceMessage(score.percentage);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 ${performance.bg}`}>
            <span className="text-4xl">
              {score.percentage >= 80 ? '🎉' : score.percentage >= 60 ? '👍' : '💪'}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h1>
          <p className={`text-lg ${performance.color}`}>{performance.message}</p>
        </div>

        {/* Score Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-lexik-blue mb-2">{score.percentage}%</div>
              <div className="text-sm text-gray-600">Overall Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{score.correct}</div>
              <div className="text-sm text-gray-600">Correct Answers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">{score.total - score.correct}</div>
              <div className="text-sm text-gray-600">Incorrect Answers</div>
            </div>
          </div>
        </div>

        {/* Question Review */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Question Review</h2>
          <div className="space-y-6">
            {questions.map((question, index) => (
              <div key={question.id} className={`border-2 rounded-xl p-6 ${
                isCorrect(question) 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-red-200 bg-red-50'
              }`}>
                {/* Question Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getQuestionTypeIcon(question.type)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Question {index + 1} - {getQuestionTypeName(question.type)}
                      </h3>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isCorrect(question)
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {isCorrect(question) ? '✓ Correct' : '✗ Incorrect'}
                  </div>
                </div>

                {/* Question Content */}
                <div className="space-y-4">
                  {question.type === quizTypes.DEFINITION_MATCH && (
                    <div>
                      <p className="text-lg font-medium text-gray-700 mb-2">Definition:</p>
                      <p className="text-gray-600 mb-4">{question.definition}</p>
                    </div>
                  )}

                  {question.type === quizTypes.SYNONYM_MATCH && (
                    <div>
                      <p className="text-lg font-medium text-gray-700 mb-2">Word:</p>
                      <p className="text-xl font-bold text-lexik-blue mb-4">{question.word}</p>
                    </div>
                  )}

                  {question.type === quizTypes.EXAMPLE_COMPLETION && (
                    <div>
                      <p className="text-lg font-medium text-gray-700 mb-2">Complete the sentence:</p>
                      <p className="text-gray-600 mb-4">{question.example}</p>
                    </div>
                  )}

                  {question.type === quizTypes.TRANSLATION && (
                    <div>
                      <p className="text-lg font-medium text-gray-700 mb-2">Persian Word:</p>
                      <p className="text-2xl font-bold text-gray-800 mb-4">{question.persianWord}</p>
                    </div>
                  )}

                  {/* Answer Options */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Your Answer:</p>
                    <div className={`inline-block px-3 py-2 rounded-lg font-medium ${
                      isCorrect(question)
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {userAnswers[question.id] || 'No answer'}
                    </div>
                  </div>

                  {!isCorrect(question) && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Correct Answer:</p>
                      <div className="inline-block px-3 py-2 rounded-lg font-medium bg-green-100 text-green-800">
                        {question.correctAnswer}
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  {question.word && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Word Details:</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Definition:</span>
                          <span className="text-gray-600 ml-2">{question.word.definition}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Synonyms:</span>
                          <span className="text-gray-600 ml-2">{question.word.synonyms}</span>
                        </div>
                        {question.word.persian && (
                          <div>
                            <span className="font-medium text-gray-700">Persian:</span>
                            <span className="text-gray-600 ml-2">{question.word.persian.word}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={onRetakeQuiz}
            className="px-8 py-3 bg-lexik-blue text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200"
          >
            Retake Quiz
          </button>
          <button
            onClick={onBackToLanding}
            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
          >
            Back to Lessons
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizReview;
