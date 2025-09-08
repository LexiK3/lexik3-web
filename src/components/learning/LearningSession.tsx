// components/learning/LearningSession.tsx
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { startSession, submitAnswer, completeSession, nextWord, previousWord, useHint } from '../../store/slices/learningSlice';
import WordCard from './WordCard';
import Card from '../common/Card';
import Button from '../common/Button';

interface LearningSessionProps {
  bookId: string;
  onComplete?: () => void;
}

const LearningSession: React.FC<LearningSessionProps> = ({ bookId, onComplete }) => {
  const dispatch = useAppDispatch();
  const { 
    currentSession, 
    currentWordIndex, 
    isLoading, 
    error,
    isPaused,
    hintsUsed,
    totalHints 
  } = useAppSelector((state) => state.learning);

  const [sessionStarted, setSessionStarted] = useState(false);
  const [currentWord, setCurrentWord] = useState<any>(null);

  useEffect(() => {
    if (!sessionStarted) {
      dispatch(startSession({ bookId, sessionType: 'daily' as any }));
      setSessionStarted(true);
    }
  }, [dispatch, bookId, sessionStarted]);

  useEffect(() => {
    if (currentSession && currentSession.words && currentSession.words[currentWordIndex]) {
      setCurrentWord(currentSession.words[currentWordIndex]);
    }
  }, [currentSession, currentWordIndex]);

  const handleAnswer = (answer: string, responseTime: number, confidence: number) => {
    if (!currentWord || !currentSession) return;

    dispatch(submitAnswer({
      sessionId: currentSession.id,
      answer: {
        wordId: currentWord.id,
        answer,
        responseTime,
        confidence,
        submittedAt: new Date().toISOString(),
        hintsUsed,
        attempts: 1,
      }
    }));
  };

  const handleNext = () => {
    if (currentSession && currentWordIndex < currentSession.words.length - 1) {
      dispatch(nextWord());
    } else {
      // Complete session
      dispatch(completeSession(currentSession.id));
      onComplete?.();
    }
  };

  const handlePrevious = () => {
    if (currentWordIndex > 0) {
      dispatch(previousWord());
    }
  };

  const handleHint = () => {
    dispatch(useHint());
  };

  const handlePause = () => {
    // Implement pause functionality
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  if (!currentSession || !currentWord) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">No Session Available</h2>
          <p className="text-gray-600 mb-4">Unable to start learning session.</p>
          <Button onClick={() => window.history.back()}>
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  const progress = ((currentWordIndex + 1) / currentSession.words.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                ← Back
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Learning Session</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {currentWordIndex + 1} of {currentSession.words.length}
              </span>
              <Button variant="outline" size="sm" onClick={handlePause}>
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WordCard
          word={currentWord}
          onAnswer={handleAnswer}
          onHint={handleHint}
          disabled={isPaused}
        />

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentWordIndex === 0}
          >
            ← Previous
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Hints used: {hintsUsed}/{totalHints}
            </p>
          </div>
          
          <Button
            onClick={handleNext}
            disabled={currentWordIndex >= currentSession.words.length - 1}
          >
            {currentWordIndex >= currentSession.words.length - 1 ? 'Complete' : 'Next →'}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default LearningSession;
