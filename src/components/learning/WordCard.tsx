// components/learning/WordCard.tsx
import React, { useState } from 'react';
import { Word, SessionWord } from '../../types/learning';
import Card from '../common/Card';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

interface WordCardProps {
  word: SessionWord;
  onAnswer: (answer: string, responseTime: number, confidence: number) => void;
  onHint: () => void;
  isAnswered?: boolean;
  showAnswer?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  error?: string | null;
}

const WordCard: React.FC<WordCardProps> = ({
  word,
  onAnswer,
  onHint,
  isAnswered = false,
  showAnswer = false,
  disabled = false,
  isLoading = false,
  error = null,
}) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [confidence, setConfidence] = useState(3);
  const [startTime] = useState(Date.now());
  const [hintsUsed, setHintsUsed] = useState(0);

  const handleSubmit = () => {
    if (!userAnswer.trim()) {
      return; // Don't submit if no answer
    }
    
    if (disabled) return;
    
    const responseTime = (Date.now() - startTime) / 1000;
    onAnswer(userAnswer.trim(), responseTime, confidence);
  };

  const handleHint = () => {
    setHintsUsed(prev => prev + 1);
    onHint();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-orange-600 bg-orange-100';
      case 'expert': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="max-w-2xl mx-auto">
        <div className="text-center py-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading word</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* Word Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">
                {word.term}
              </h2>
              {word.isNew && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  NEW
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(word.difficulty)}`}>
                {word.difficulty}
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full capitalize">
                {word.partOfSpeech}
              </span>
            </div>
          </div>
          
          {word.pronunciation && (
            <div className="text-sm text-gray-500 font-mono">
              {word.pronunciation}
            </div>
          )}
        </div>

        {/* Definition */}
        {showAnswer && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Definition:</h3>
            <p className="text-blue-800">{word.definition}</p>
          </div>
        )}

        {/* Examples */}
        {word.examples.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Examples:</h3>
            <ul className="space-y-1">
              {word.examples.map((example, index) => (
                <li key={index} className="text-gray-700 text-sm">
                  • {example}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Answer Input */}
        {!isAnswered && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What does this word mean?
              </label>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                disabled={disabled}
              />
              {!userAnswer.trim() && (
                <p className="text-red-500 text-sm mt-1">Please enter an answer</p>
              )}
            </div>

            {/* Confidence Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confidence: {confidence}
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={confidence}
                onChange={(e) => setConfidence(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                disabled={disabled}
                role="slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Not sure</span>
                <span>Very confident</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handleHint}
                disabled={disabled || hintsUsed >= 2}
                size="sm"
              >
                Hint ({hintsUsed}/2)
              </Button>
              
              <Button
                onClick={handleSubmit}
                disabled={!userAnswer.trim() || disabled}
                size="lg"
              >
                Submit Answer
              </Button>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        {word.userProgress && (
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Mastery Level: {word.userProgress.masteryLevel}</span>
              </div>
              <div>
                <span className="font-medium">Times Reviewed: {word.userProgress.timesReviewed}</span>
              </div>
              <div>
                <span className="font-medium">Last Correct: {word.userProgress.lastCorrect ? 'Yes' : 'No'}</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(word.userProgress.masteryLevel / 5) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default WordCard;
