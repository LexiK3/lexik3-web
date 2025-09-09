// components/progress/__tests__/ProgressChart.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import ProgressChart from '../ProgressChart';
import { DailyActivity } from '../../../types/progress';

// Mock recharts components
jest.mock('recharts', () => ({
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Line: ({ dataKey, stroke, strokeWidth }: any) => (
    <div data-testid="line" data-key={dataKey} data-stroke={stroke} data-stroke-width={strokeWidth} />
  ),
  Bar: ({ dataKey, fill }: any) => (
    <div data-testid="bar" data-key={dataKey} data-fill={fill} />
  ),
  XAxis: ({ dataKey }: any) => <div data-testid="x-axis" data-key={dataKey} />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
}));

const mockData: DailyActivity[] = [
  {
    date: '2024-01-01',
    wordsStudied: 10,
    accuracy: 0.8,
    studyTime: 15,
    sessionsCompleted: 1,
    newWordsLearned: 5,
    wordsReviewed: 5,
    streakMaintained: true,
    achievementsUnlocked: 0,
    booksStudied: ['book-1'],
  },
  {
    date: '2024-01-02',
    wordsStudied: 15,
    accuracy: 0.9,
    studyTime: 20,
    sessionsCompleted: 2,
    newWordsLearned: 8,
    wordsReviewed: 7,
    streakMaintained: true,
    achievementsUnlocked: 1,
    booksStudied: ['book-1'],
  },
  {
    date: '2024-01-03',
    wordsStudied: 12,
    accuracy: 0.85,
    studyTime: 18,
    sessionsCompleted: 1,
    newWordsLearned: 6,
    wordsReviewed: 6,
    streakMaintained: true,
    achievementsUnlocked: 0,
    booksStudied: ['book-1'],
  },
];

describe('ProgressChart Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render line chart by default', () => {
    render(<ProgressChart data={mockData} />);
    
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('line')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });

  it('should render bar chart when type is bar', () => {
    render(<ProgressChart data={mockData} type="bar" />);
    
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar')).toBeInTheDocument();
    expect(screen.queryByTestId('line')).not.toBeInTheDocument();
  });

  it('should display custom title', () => {
    render(<ProgressChart data={mockData} title="Custom Progress" />);
    
    expect(screen.getByText('Custom Progress')).toBeInTheDocument();
  });

  it('should use default title when not provided', () => {
    render(<ProgressChart data={mockData} />);
    
    expect(screen.getByText('Progress')).toBeInTheDocument();
  });

  it('should use custom data key for line chart', () => {
    render(<ProgressChart data={mockData} dataKey="accuracy" />);
    
    const lineElement = screen.getByTestId('line');
    expect(lineElement).toHaveAttribute('data-key', 'accuracy');
  });

  it('should use custom data key for bar chart', () => {
    render(<ProgressChart data={mockData} type="bar" dataKey="studyTime" />);
    
    const barElement = screen.getByTestId('bar');
    expect(barElement).toHaveAttribute('data-key', 'studyTime');
  });

  it('should use custom color for line chart', () => {
    render(<ProgressChart data={mockData} color="#FF0000" />);
    
    const lineElement = screen.getByTestId('line');
    expect(lineElement).toHaveAttribute('data-stroke', '#FF0000');
  });

  it('should use custom color for bar chart', () => {
    render(<ProgressChart data={mockData} type="bar" color="#00FF00" />);
    
    const barElement = screen.getByTestId('bar');
    expect(barElement).toHaveAttribute('data-fill', '#00FF00');
  });

  it('should format dates correctly in x-axis', () => {
    render(<ProgressChart data={mockData} />);
    
    const xAxisElement = screen.getByTestId('x-axis');
    expect(xAxisElement).toHaveAttribute('data-key', 'formattedDate');
  });

  it('should handle empty data array', () => {
    render(<ProgressChart data={[]} />);
    
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByText('Progress')).toBeInTheDocument();
  });

  it('should render with responsive container', () => {
    render(<ProgressChart data={mockData} />);
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('should use default data key when not provided', () => {
    render(<ProgressChart data={mockData} />);
    
    const lineElement = screen.getByTestId('line');
    expect(lineElement).toHaveAttribute('data-key', 'wordsStudied');
  });

  it('should use default color when not provided', () => {
    render(<ProgressChart data={mockData} />);
    
    const lineElement = screen.getByTestId('line');
    expect(lineElement).toHaveAttribute('data-stroke', '#3B82F6');
  });

  it('should render line with correct stroke width', () => {
    render(<ProgressChart data={mockData} />);
    
    const lineElement = screen.getByTestId('line');
    expect(lineElement).toHaveAttribute('data-stroke-width', '2');
  });

  it('should handle single data point', () => {
    const singleData = [mockData[0]];
    render(<ProgressChart data={singleData} />);
    
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('line')).toBeInTheDocument();
  });

  it('should render within card component', () => {
    render(<ProgressChart data={mockData} />);
    
    // The chart should be wrapped in a Card component
    expect(screen.getByText('Progress')).toBeInTheDocument();
  });

  it('should handle different chart types correctly', () => {
    const { rerender } = render(<ProgressChart data={mockData} type="line" />);
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();

    rerender(<ProgressChart data={mockData} type="bar" />);
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
  });
});
