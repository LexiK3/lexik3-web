// components/progress/__tests__/AchievementCard.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AchievementCard from '../AchievementCard';
import { Achievement } from '../../../types/progress';

// Mock the Card component
jest.mock('../../common/Card', () => {
  return function MockCard({ children, className, onClick, ...props }: any) {
    return (
      <div 
        className={className}
        onClick={onClick}
        data-testid="achievement-card"
        {...props}
      >
        {children}
      </div>
    );
  };
});

const mockUnlockedAchievement: Achievement = {
  id: 'achievement-1',
  name: 'First Steps',
  description: 'Complete your first learning session',
  type: 'session' as any,
  category: 'learning',
  icon: '🎯',
  points: 10,
  rarity: 'common',
  requirements: [
    {
      type: 'sessions',
      value: 1,
      description: 'Complete 1 session',
      isCompleted: true,
    },
  ],
  isUnlocked: true,
  unlockedAt: '2024-01-01T10:00:00Z',
  progress: 1,
  isSecret: false,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T10:00:00Z',
};

const mockLockedAchievement: Achievement = {
  id: 'achievement-2',
  name: 'Word Master',
  description: 'Learn 100 words',
  type: 'words' as any,
  category: 'learning',
  icon: '📚',
  points: 50,
  rarity: 'rare',
  requirements: [
    {
      type: 'words',
      value: 100,
      description: 'Learn 100 words',
      isCompleted: false,
    },
  ],
  isUnlocked: false,
  progress: 0.3,
  isSecret: false,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const mockSecretAchievement: Achievement = {
  id: 'achievement-3',
  name: 'Secret Achievement',
  description: 'This is a secret achievement',
  type: 'streak' as any,
  category: 'streak',
  icon: '🔒',
  points: 100,
  rarity: 'legendary',
  requirements: [
    {
      type: 'streak',
      value: 30,
      description: 'Maintain a 30-day streak',
      isCompleted: false,
    },
  ],
  isUnlocked: false,
  progress: 0.1,
  isSecret: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

describe('AchievementCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render unlocked achievement correctly', () => {
    render(<AchievementCard achievement={mockUnlockedAchievement} />);
    
    expect(screen.getByText('First Steps')).toBeInTheDocument();
    expect(screen.getByText('Complete your first learning session')).toBeInTheDocument();
    expect(screen.getByText('🎯')).toBeInTheDocument();
    expect(screen.getByText('COMMON')).toBeInTheDocument();
    expect(screen.getByText('10 points')).toBeInTheDocument();
    expect(screen.getByText('✓ Unlocked')).toBeInTheDocument();
  });

  it('should render locked achievement with progress bar', () => {
    render(<AchievementCard achievement={mockLockedAchievement} />);
    
    expect(screen.getByText('Word Master')).toBeInTheDocument();
    expect(screen.getByText('Learn 100 words')).toBeInTheDocument();
    expect(screen.getByText('📚')).toBeInTheDocument();
    expect(screen.getByText('RARE')).toBeInTheDocument();
    expect(screen.getByText('50 points')).toBeInTheDocument();
    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('30%')).toBeInTheDocument();
    expect(screen.queryByText('✓ Unlocked')).not.toBeInTheDocument();
  });

  it('should apply correct rarity colors for common achievement', () => {
    render(<AchievementCard achievement={mockUnlockedAchievement} />);
    
    const card = screen.getByTestId('achievement-card');
    expect(card).toHaveClass('border-gray-300', 'bg-gray-50');
  });

  it('should apply correct rarity colors for rare achievement', () => {
    render(<AchievementCard achievement={mockLockedAchievement} />);
    
    const card = screen.getByTestId('achievement-card');
    expect(card).toHaveClass('border-blue-300', 'bg-blue-50');
  });

  it('should apply correct rarity colors for legendary achievement', () => {
    render(<AchievementCard achievement={mockSecretAchievement} />);
    
    const card = screen.getByTestId('achievement-card');
    expect(card).toHaveClass('border-yellow-300', 'bg-yellow-50');
  });

  it('should display progress bar with correct width for locked achievement', () => {
    render(<AchievementCard achievement={mockLockedAchievement} />);
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveStyle('width: 30%');
  });

  it('should not display progress bar for unlocked achievement', () => {
    render(<AchievementCard achievement={mockUnlockedAchievement} />);
    
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('should not display progress bar for achievement with 100% progress', () => {
    const completedAchievement = { ...mockLockedAchievement, progress: 1 };
    render(<AchievementCard achievement={completedAchievement} />);
    
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('should display unlocked date for unlocked achievement', () => {
    render(<AchievementCard achievement={mockUnlockedAchievement} />);
    
    expect(screen.getByText(/Unlocked 1\/1\/2024/)).toBeInTheDocument();
  });

  it('should not display unlocked date for locked achievement', () => {
    render(<AchievementCard achievement={mockLockedAchievement} />);
    
    expect(screen.queryByText(/Unlocked/)).not.toBeInTheDocument();
  });

  it('should handle click event when onClick is provided', () => {
    const mockOnClick = jest.fn();
    render(<AchievementCard achievement={mockUnlockedAchievement} onClick={mockOnClick} />);
    
    const card = screen.getByTestId('achievement-card');
    fireEvent.click(card);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should not be clickable when onClick is not provided', () => {
    render(<AchievementCard achievement={mockUnlockedAchievement} />);
    
    const card = screen.getByTestId('achievement-card');
    expect(card).not.toHaveClass('cursor-pointer');
  });

  it('should apply hover styles when clickable', () => {
    const mockOnClick = jest.fn();
    render(<AchievementCard achievement={mockUnlockedAchievement} onClick={mockOnClick} />);
    
    const card = screen.getByTestId('achievement-card');
    expect(card).toHaveClass('cursor-pointer', 'hover:shadow-lg', 'transition-shadow');
  });

  it('should truncate long achievement names', () => {
    const longNameAchievement = {
      ...mockUnlockedAchievement,
      name: 'This is a very long achievement name that should be truncated',
    };
    render(<AchievementCard achievement={longNameAchievement} />);
    
    const nameElement = screen.getByText(longNameAchievement.name);
    expect(nameElement).toHaveClass('truncate');
  });

  it('should display correct rarity text colors', () => {
    const { rerender } = render(<AchievementCard achievement={mockUnlockedAchievement} />);
    expect(screen.getByText('COMMON')).toHaveClass('text-gray-600');
    
    rerender(<AchievementCard achievement={mockLockedAchievement} />);
    expect(screen.getByText('RARE')).toHaveClass('text-blue-600');
    
    rerender(<AchievementCard achievement={mockSecretAchievement} />);
    expect(screen.getByText('LEGENDARY')).toHaveClass('text-yellow-600');
  });

  it('should handle achievement with no unlocked date', () => {
    const achievementWithoutDate = { ...mockUnlockedAchievement, unlockedAt: undefined };
    render(<AchievementCard achievement={achievementWithoutDate} />);
    
    // Should still show "✓ Unlocked" but not the date
    expect(screen.getByText('✓ Unlocked')).toBeInTheDocument();
    expect(screen.queryByText(/Unlocked 1\/1\/2024/)).not.toBeInTheDocument();
  });

  it('should display correct icon for achievement', () => {
    render(<AchievementCard achievement={mockUnlockedAchievement} />);
    
    expect(screen.getByText('🎯')).toBeInTheDocument();
  });

  it('should handle different achievement types', () => {
    const sessionAchievement = { ...mockUnlockedAchievement, type: 'session' as any };
    const wordAchievement = { ...mockUnlockedAchievement, type: 'words' as any };
    const streakAchievement = { ...mockUnlockedAchievement, type: 'streak' as any };
    
    const { rerender } = render(<AchievementCard achievement={sessionAchievement} />);
    expect(screen.getByText('First Steps')).toBeInTheDocument();
    
    rerender(<AchievementCard achievement={wordAchievement} />);
    expect(screen.getByText('First Steps')).toBeInTheDocument();
    
    rerender(<AchievementCard achievement={streakAchievement} />);
    expect(screen.getByText('First Steps')).toBeInTheDocument();
  });

  it('should handle achievement with zero progress', () => {
    const zeroProgressAchievement = { ...mockLockedAchievement, progress: 0 };
    render(<AchievementCard achievement={zeroProgressAchievement} />);
    
    expect(screen.getByText('0%')).toBeInTheDocument();
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveStyle('width: 0%');
  });

  it('should handle achievement with maximum progress but not unlocked', () => {
    const maxProgressAchievement = { ...mockLockedAchievement, progress: 0.99 };
    render(<AchievementCard achievement={maxProgressAchievement} />);
    
    expect(screen.getByText('99%')).toBeInTheDocument();
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveStyle('width: 99%');
  });
});
