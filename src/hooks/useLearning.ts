// hooks/useLearning.ts
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  startSession, 
  submitAnswer, 
  completeSession, 
  nextWord, 
  previousWord, 
  useHint, 
  pauseSession, 
  resumeSession 
} from '../store/slices/learningSlice';

/**
 * Custom hook for learning operations
 * Provides a clean interface for learning-related actions and state
 */
export const useLearning = () => {
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

  const start = async (bookId: string, sessionType: string) => {
    const result = await dispatch(startSession({ bookId, sessionType: sessionType as any }));
    return result;
  };

  const submit = async (answer: any) => {
    const result = await dispatch(submitAnswer(answer));
    return result;
  };

  const complete = async (sessionId: string) => {
    const result = await dispatch(completeSession(sessionId));
    return result;
  };

  const next = () => {
    dispatch(nextWord());
  };

  const previous = () => {
    dispatch(previousWord());
  };

  const hint = () => {
    dispatch(useHint());
  };

  const pause = () => {
    dispatch(pauseSession());
  };

  const resume = () => {
    dispatch(resumeSession());
  };

  const togglePause = () => {
    if (isPaused) {
      resume();
    } else {
      pause();
    }
  };

  const getCurrentWord = () => {
    if (currentSession && currentSession.words && currentSession.words[currentWordIndex]) {
      return currentSession.words[currentWordIndex];
    }
    return null;
  };

  const getProgress = () => {
    if (!currentSession) return 0;
    return ((currentWordIndex + 1) / currentSession.words.length) * 100;
  };

  const isLastWord = () => {
    if (!currentSession) return false;
    return currentWordIndex >= currentSession.words.length - 1;
  };

  const isFirstWord = () => {
    return currentWordIndex === 0;
  };

  return {
    currentSession,
    currentWordIndex,
    isLoading,
    error,
    isPaused,
    hintsUsed,
    totalHints,
    start,
    submit,
    complete,
    next,
    previous,
    hint,
    pause,
    resume,
    togglePause,
    getCurrentWord,
    getProgress,
    isLastWord,
    isFirstWord,
  };
};
