// tests/unit/components/Input.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../../../src/components/common/Input';

describe('Input Component', () => {
  it('renders with default props', () => {
    render(<Input value="" onChange={() => {}} />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  it('renders with label', () => {
    render(<Input label="Test Label" value="" onChange={() => {}} />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    render(<Input placeholder="Enter text" value="" onChange={() => {}} />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('handles value changes', () => {
    const handleChange = jest.fn();
    render(<Input value="" onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test input' } });
    expect(handleChange).toHaveBeenCalledWith('test input');
  });

  it('shows error message', () => {
    render(<Input value="" onChange={() => {}} error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('renders as disabled', () => {
    render(<Input value="" onChange={() => {}} disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('renders as required', () => {
    render(<Input label="Required Field" value="" onChange={() => {}} required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders with icon', () => {
    const icon = <span data-testid="icon">🔍</span>;
    render(<Input value="" onChange={() => {}} icon={icon} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders different input types', () => {
    const { rerender } = render(<Input type="email" value="" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');

    rerender(<Input type="password" value="" onChange={() => {}} />);
    expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'password');
  });

  it('applies custom className', () => {
    render(<Input value="" onChange={() => {}} className="custom-class" />);
    expect(screen.getByRole('textbox').parentElement).toHaveClass('custom-class');
  });
});
