// components/learning/__tests__/WordCard.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WordCard from '../WordCard';
import { SessionWord } from '../../../types/learning';

// Mock the Button component
jest.mock('../../common/Button', () => {
  return function MockButton({ children, onClick, disabled, variant, size, ...props }: any) {
    return (
      <button 
        onClick={onClick} 
        disabled={disabled}
        data-variant={variant}
        data-size={size}
        {...props}
      >
        {children}
      </button>
    );
  };
});

const mockWord: SessionWord = {
  id: 'word-1',
  term: 'abundant',
  definition: 'existing in large quantities; plentiful',
  pronunciation: '/əˈbʌndənt/',
  difficulty: 'intermediate' as any,
  partOfSpeech: 'adjective' as any,
  examples: [
    'The region has abundant natural resources.',
    'She has abundant energy in the morning.'
  ],
  isNew: true,
  order: 1,
};

const mockWordWithProgress: SessionWord = {
  ...mockWord,
  userProgress: {
    masteryLevel: 3,
    nextReview: new Date().toISOString(),
    timesReviewed: 5,
    timesCorrect: 4,
    lastCorrect: true,
    lastReviewed: new Date().toISOString(),
    totalTimeSpent: 120,
    confidence: 4,
    isMastered: false,
    streak: 3,
    difficultyAdjustment: 1.2,
  },
};

describe('WordCard Component', () => {
  const mockOnAnswer = jest.fn();
  const mockOnHint = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render word information correctly', () => {
    render(
      <WordCard 
        word={mockWord} 
        onAnswer={mockOnAnswer} 
        onHint={mockOnHint} 
      />
    );

    expect(screen.getByText('abundant')).toBeInTheDocument();
    // Definition is only shown when showAnswer is true
    expect(screen.queryByText('existing in large quantities; plentiful')).not.toBeInTheDocument();
    expect(screen.getByText('/əˈbʌndənt/')).toBeInTheDocument();
    expect(screen.getByText('adjective')).toBeInTheDocument();
    expect(screen.getByText('intermediate')).toBeInTheDocument();
  });

  it('should display examples when provided', () => {
    render(
      <WordCard 
        word={mockWord} 
        onAnswer={mockOnAnswer} 
        onHint={mockOnHint} 
      />
    );

    // Examples are shown with bullet points, so we need to match the full text including the bullet
    expect(screen.getByText(/The region has abundant natural resources\./)).toBeInTheDocument();
    expect(screen.getByText(/She has abundant energy in the morning\./)).toBeInTheDocument();
  });

  it('should show new word indicator for new words', () => {
    render(
      <WordCard 
        word={mockWord} 
        onAnswer={mockOnAnswer} 
        onHint={mockOnHint} 
      />
    );

    expect(screen.getByText('NEW')).toBeInTheDocument();
  });

  it('should not show new word indicator for review words', () => {
    const reviewWord = { ...mockWord, isNew: false };
    
    render(
      <WordCard 
        word={reviewWord} 
        onAnswer={mockOnAnswer} 
        onHint={mockOnHint} 
      />
    );

    expect(screen.queryByText('NEW')).not.toBeInTheDocument();
  });

  it('should display user progress when available', () => {
    render(
      <WordCard 
        word={mockWordWithProgress} 
        onAnswer={mockOnAnswer} 
        onHint={mockOnHint} 
      />
    );

    expect(screen.getByText('Mastery Level: 3')).toBeInTheDocument();
    expect(screen.getByText('Times Reviewed: 5')).toBeInTheDocument();
    expect(screen.getByText('Last Correct: Yes')).toBeInTheDocument();
  });

  it('should handle answer submission with correct parameters', async () => {
    render(
      <WordCard 
        word={mockWord} 
        onAnswer={mockOnAnswer} 
        onHint={mockOnHint} 
      />
    );

    const answerInput = screen.getByPlaceholderText('Type your answer here...');
    const confidenceSlider = screen.getByRole('slider');
    const submitButton = screen.getByText('Submit Answer');

    fireEvent.change(answerInput, { target: { value: 'plentiful' } });
    fireEvent.change(confidenceSlider, { target: { value: '4' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnAnswer).toHaveBeenCalledWith(
        'plentiful',
        expect.any(Number), // responseTime
        4 // confidence
      );
    });
  });

  it('should validate answer input before submission', async () => {
    render(
      <WordCard 
        word={mockWord} 
        onAnswer={mockOnAnswer} 
        onHint={mockOnHint} 
      />
    );

    const submitButton = screen.getByText('Submit Answer');
    fireEvent.click(submitButton);

    expect(screen.getByText('Please enter an answer')).toBeInTheDocument();
    expect(mockOnAnswer).not.toHaveBeenCalled();
  });

  it('should handle hint usage', () => {
    render(
      <WordCard 
        word={mockWord} 
        onAnswer={mockOnAnswer} 
        onHint={mockOnHint} 
      />
    );

    const hintButton = screen.getByText(/Hint \(/);
    fireEvent.click(hintButton);

    expect(mockOnHint).toHaveBeenCalled();
  });

  it('should disable form when disabled prop is true', () => {
    render(
      <WordCard 
        word={mockWord} 
        onAnswer={mockOnAnswer} 
        onHint={mockOnHint} 
        disabled={true}
      />
    );

    const answerInput = screen.getByPlaceholderText('Type your answer here...');
    const submitButton = screen.getByText('Submit Answer');
    const hintButton = screen.getByText(/Hint \(/);

    expect(answerInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
    expect(hintButton).toBeDisabled();
  });

  it('should show difficulty level with appropriate color', () => {
    render(
      <WordCard 
        word={mockWord} 
        onAnswer={mockOnAnswer} 
        onHint={mockOnHint} 
      />
    );

    const difficultyBadge = screen.getByText('intermediate');
    expect(difficultyBadge).toHaveClass('bg-yellow-100', 'text-yellow-600');
  });

  it('should show part of speech with appropriate styling', () => {
    render(
      <WordCard 
        word={mockWord} 
        onAnswer={mockOnAnswer} 
        onHint={mockOnHint} 
      />
    );

    const partOfSpeech = screen.getByText('adjective');
    expect(partOfSpeech).toHaveClass('bg-blue-100', 'text-blue-800');
  });

  it('should handle pronunciation display', () => {
    render(
      <WordCard 
        word={mockWord} 
        onAnswer={mockOnAnswer} 
        onHint={mockOnHint} 
      />
    );

    const pronunciation = screen.getByText('/əˈbʌndənt/');
    expect(pronunciation).toBeInTheDocument();
  });

  it('should show confidence slider with correct range', () => {
    render(
      <WordCard 
        word={mockWord} 
        onAnswer={mockOnAnswer} 
        onHint={mockOnHint} 
      />
    );

    const confidenceSlider = screen.getByRole('slider');
    expect(confidenceSlider).toHaveAttribute('min', '1');
    expect(confidenceSlider).toHaveAttribute('max', '5');
    expect(confidenceSlider).toHaveAttribute('value', '3');
  });

  it('should update confidence display when slider changes', () => {
    render(
      <WordCard 
        word={mockWord} 
        onAnswer={mockOnAnswer} 
        onHint={mockOnHint} 
      />
    );

    const confidenceSlider = screen.getByRole('slider');
    fireEvent.change(confidenceSlider, { target: { value: '5' } });

    expect(screen.getByText('Confidence: 5')).toBeInTheDocument();
  });

  it('should show response time tracking', async () => {
    render(
      <WordCard 
        word={mockWord} 
        onAnswer={mockOnAnswer} 
        onHint={mockOnHint} 
      />
    );

    // Wait a bit to simulate user thinking time
    await new Promise(resolve => setTimeout(resolve, 100));

    const answerInput = screen.getByPlaceholderText('Type your answer here...');
    const submitButton = screen.getByText('Submit Answer');

    fireEvent.change(answerInput, { target: { value: 'plentiful' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnAnswer).toHaveBeenCalledWith(
        'plentiful',
        expect.any(Number), // responseTime should be > 0
        3 // default confidence
      );
    });
  });

  it('should handle word without pronunciation gracefully', () => {
    const wordWithoutPronunciation = { ...mockWord, pronunciation: undefined };
    
    render(
      <WordCard 
        word={wordWithoutPronunciation} 
        onAnswer={mockOnAnswer} 
        onHint={mockOnHint} 
      />
    );

    expect(screen.getByText('abundant')).toBeInTheDocument();
    expect(screen.queryByText('/əˈbʌndənt/')).not.toBeInTheDocument();
  });

  it('should handle word without examples gracefully', () => {
    const wordWithoutExamples = { ...mockWord, examples: [] };
    
    render(
      <WordCard 
        word={wordWithoutExamples} 
        onAnswer={mockOnAnswer} 
        onHint={mockOnHint} 
      />
    );

    expect(screen.getByText('abundant')).toBeInTheDocument();
    expect(screen.queryByText('Examples:')).not.toBeInTheDocument();
  });
});
