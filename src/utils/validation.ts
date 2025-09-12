// utils/validation.ts
/**
 * Validation utility functions
 * Provides common validation patterns used throughout the application
 */

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Name validation
export const isValidName = (name: string): boolean => {
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/;
  return nameRegex.test(name.trim());
};

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

// Phone number validation (basic)
export const isValidPhoneNumber = (phone: string): boolean => {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  const phoneRegex = /^[\+]?[1-9][\d]{8,15}$/;
  return phoneRegex.test(cleaned);
};

// Date validation
export const isValidDate = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
};

// Age validation
export const isValidAge = (age: number): boolean => {
  return age >= 13 && age <= 120;
};

// Form validation helper
export const validateForm = (data: Record<string, any>, rules: Record<string, (value: any) => string | null>): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  Object.keys(rules).forEach(field => {
    const value = data[field];
    const error = rules[field](value);
    if (error) {
      errors[field] = error;
    }
  });
  
  return errors;
};

// Common validation rules
export const validationRules = {
  required: (value: any) => {
    if (value === null || value === undefined || value === '') {
      return 'This field is required';
    }
    return null;
  },
  
  email: (value: string) => {
    if (value && !isValidEmail(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  },
  
  password: (value: string) => {
    if (value) {
      const { isValid, errors } = isValidPassword(value);
      if (!isValid) {
        return errors[0]; // Return first error
      }
    }
    return null;
  },
  
  minLength: (min: number) => (value: string) => {
    if (value && value.length < min) {
      return `Must be at least ${min} characters long`;
    }
    return null;
  },
  
  maxLength: (max: number) => (value: string) => {
    if (value && value.length > max) {
      return `Must be no more than ${max} characters long`;
    }
    return null;
  },
  
  name: (value: string) => {
    if (value && !isValidName(value)) {
      return 'Please enter a valid name (letters, spaces, hyphens, and apostrophes only)';
    }
    return null;
  },
  
  phone: (value: string) => {
    if (value && !isValidPhoneNumber(value)) {
      return 'Please enter a valid phone number';
    }
    return null;
  },
  
  url: (value: string) => {
    if (value && !isValidUrl(value)) {
      return 'Please enter a valid URL';
    }
    return null;
  },
  
  date: (value: string) => {
    if (value && !isValidDate(value)) {
      return 'Please enter a valid date';
    }
    return null;
  },
  
  age: (value: number) => {
    if (value && !isValidAge(value)) {
      return 'Age must be between 13 and 120';
    }
    return null;
  }
};
