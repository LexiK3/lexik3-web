// components/common/__tests__/LoadingSpinner.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('img', { hidden: true });
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('animate-spin', 'h-8', 'w-8', 'text-blue-600');
  });

  it('renders with custom size', () => {
    render(<LoadingSpinner size="lg" />);
    
    const spinner = screen.getByRole('img', { hidden: true });
    expect(spinner).toHaveClass('h-12', 'w-12');
  });

  it('renders with custom color', () => {
    render(<LoadingSpinner color="white" />);
    
    const spinner = screen.getByRole('img', { hidden: true });
    expect(spinner).toHaveClass('text-white');
  });

  it('renders with text', () => {
    render(<LoadingSpinner text="Loading..." />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    render(<LoadingSpinner className="custom-class" />);
    
    const container = screen.getByRole('img', { hidden: true }).parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('renders all size variants correctly', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />);
    expect(screen.getByRole('img', { hidden: true })).toHaveClass('h-4', 'w-4');

    rerender(<LoadingSpinner size="md" />);
    expect(screen.getByRole('img', { hidden: true })).toHaveClass('h-8', 'w-8');

    rerender(<LoadingSpinner size="lg" />);
    expect(screen.getByRole('img', { hidden: true })).toHaveClass('h-12', 'w-12');
  });

  it('renders all color variants correctly', () => {
    const { rerender } = render(<LoadingSpinner color="primary" />);
    expect(screen.getByRole('img', { hidden: true })).toHaveClass('text-blue-600');

    rerender(<LoadingSpinner color="secondary" />);
    expect(screen.getByRole('img', { hidden: true })).toHaveClass('text-gray-600');

    rerender(<LoadingSpinner color="white" />);
    expect(screen.getByRole('img', { hidden: true })).toHaveClass('text-white');

    rerender(<LoadingSpinner color="gray" />);
    expect(screen.getByRole('img', { hidden: true })).toHaveClass('text-gray-400');
  });
});
