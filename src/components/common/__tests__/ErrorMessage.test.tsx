// components/common/__tests__/ErrorMessage.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorMessage from '../ErrorMessage';

describe('ErrorMessage', () => {
  it('does not render when error is null', () => {
    render(<ErrorMessage error={null} />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders error message', () => {
    render(<ErrorMessage error="Something went wrong" />);
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('bg-red-50', 'border-red-200', 'text-red-800');
  });

  it('renders with different variants', () => {
    const { rerender } = render(<ErrorMessage error="Error" variant="error" />);
    expect(screen.getByRole('alert')).toHaveClass('bg-red-50', 'border-red-200', 'text-red-800');

    rerender(<ErrorMessage error="Warning" variant="warning" />);
    expect(screen.getByRole('alert')).toHaveClass('bg-yellow-50', 'border-yellow-200', 'text-yellow-800');

    rerender(<ErrorMessage error="Info" variant="info" />);
    expect(screen.getByRole('alert')).toHaveClass('bg-blue-50', 'border-blue-200', 'text-blue-800');
  });

  it('calls onRetry when retry button is clicked', () => {
    const onRetry = jest.fn();
    render(<ErrorMessage error="Error" onRetry={onRetry} />);
    
    const retryButton = screen.getByLabelText('Retry');
    fireEvent.click(retryButton);
    
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('calls onDismiss when dismiss button is clicked', () => {
    const onDismiss = jest.fn();
    render(<ErrorMessage error="Error" onDismiss={onDismiss} />);
    
    const dismissButton = screen.getByLabelText('Dismiss');
    fireEvent.click(dismissButton);
    
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not show retry button when onRetry is not provided', () => {
    render(<ErrorMessage error="Error" />);
    expect(screen.queryByLabelText('Retry')).not.toBeInTheDocument();
  });

  it('does not show dismiss button when onDismiss is not provided', () => {
    render(<ErrorMessage error="Error" />);
    expect(screen.queryByLabelText('Dismiss')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<ErrorMessage error="Error" className="custom-class" />);
    expect(screen.getByRole('alert')).toHaveClass('custom-class');
  });
});
