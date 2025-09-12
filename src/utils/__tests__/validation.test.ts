// utils/__tests__/validation.test.ts
import {
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidUrl,
  isValidPhoneNumber,
  isValidDate,
  isValidAge,
  validateForm,
  validationRules
} from '../validation';

describe('Validation Utilities', () => {
  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('test+tag@example.org')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('should validate strong passwords', () => {
      const result = isValidPassword('StrongPass123!');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject weak passwords', () => {
      const result = isValidPassword('weak');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should check for uppercase letter', () => {
      const result = isValidPassword('lowercase123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should check for lowercase letter', () => {
      const result = isValidPassword('UPPERCASE123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    it('should check for number', () => {
      const result = isValidPassword('NoNumbers!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('should check for special character', () => {
      const result = isValidPassword('NoSpecial123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one special character');
    });

    it('should check minimum length', () => {
      const result = isValidPassword('Short1!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });
  });

  describe('isValidName', () => {
    it('should validate correct names', () => {
      expect(isValidName('John Doe')).toBe(true);
      expect(isValidName('Mary-Jane')).toBe(true);
      expect(isValidName("O'Connor")).toBe(true);
      expect(isValidName('José María')).toBe(true);
    });

    it('should reject invalid names', () => {
      expect(isValidName('J')).toBe(false);
      expect(isValidName('John123')).toBe(false);
      expect(isValidName('John@Doe')).toBe(false);
      expect(isValidName('')).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('should validate correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://localhost:3000')).toBe(true);
      expect(isValidUrl('https://subdomain.example.com/path')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('ftp://example.com')).toBe(false);
      expect(isValidUrl('')).toBe(false);
    });
  });

  describe('isValidPhoneNumber', () => {
    it('should validate correct phone numbers', () => {
      expect(isValidPhoneNumber('1234567890')).toBe(true);
      expect(isValidPhoneNumber('+1234567890')).toBe(true);
      expect(isValidPhoneNumber('(123) 456-7890')).toBe(true);
      expect(isValidPhoneNumber('123-456-7890')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhoneNumber('123')).toBe(false);
      expect(isValidPhoneNumber('abc123')).toBe(false);
      expect(isValidPhoneNumber('')).toBe(false);
    });
  });

  describe('isValidDate', () => {
    it('should validate correct dates', () => {
      expect(isValidDate('2023-01-01')).toBe(true);
      expect(isValidDate(new Date())).toBe(true);
      expect(isValidDate('2023-12-31T23:59:59Z')).toBe(true);
    });

    it('should reject invalid dates', () => {
      expect(isValidDate('invalid-date')).toBe(false);
      expect(isValidDate('2023-13-01')).toBe(false);
      expect(isValidDate('')).toBe(false);
    });
  });

  describe('isValidAge', () => {
    it('should validate correct ages', () => {
      expect(isValidAge(18)).toBe(true);
      expect(isValidAge(25)).toBe(true);
      expect(isValidAge(100)).toBe(true);
    });

    it('should reject invalid ages', () => {
      expect(isValidAge(12)).toBe(false);
      expect(isValidAge(121)).toBe(false);
      expect(isValidAge(-1)).toBe(false);
    });
  });

  describe('validateForm', () => {
    it('should validate form data correctly', () => {
      const data = {
        email: 'test@example.com',
        password: 'StrongPass123!',
        name: 'John Doe'
      };

      const rules = {
        email: validationRules.email,
        password: validationRules.password,
        name: validationRules.name
      };

      const errors = validateForm(data, rules);
      expect(errors).toEqual({});
    });

    it('should return errors for invalid data', () => {
      const data = {
        email: 'invalid-email',
        password: 'weak',
        name: 'J'
      };

      const rules = {
        email: validationRules.email,
        password: validationRules.password,
        name: validationRules.name
      };

      const errors = validateForm(data, rules);
      expect(errors.email).toBeDefined();
      expect(errors.password).toBeDefined();
      expect(errors.name).toBeDefined();
    });
  });

  describe('validationRules', () => {
    describe('required', () => {
      it('should validate required fields', () => {
        expect(validationRules.required('value')).toBeNull();
        expect(validationRules.required('')).toBe('This field is required');
        expect(validationRules.required(null)).toBe('This field is required');
        expect(validationRules.required(undefined)).toBe('This field is required');
      });
    });

    describe('minLength', () => {
      it('should validate minimum length', () => {
        const rule = validationRules.minLength(5);
        expect(rule('hello')).toBeNull();
        expect(rule('hi')).toBe('Must be at least 5 characters long');
      });
    });

    describe('maxLength', () => {
      it('should validate maximum length', () => {
        const rule = validationRules.maxLength(10);
        expect(rule('hello')).toBeNull();
        expect(rule('this is too long')).toBe('Must be no more than 10 characters long');
      });
    });
  });
});
