// utils/__tests__/formatting.test.ts
import {
  formatDate,
  formatTime,
  formatRelativeTime,
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatFileSize,
  formatDuration,
  capitalize,
  capitalizeWords,
  truncateText,
  slugify,
  formatFullName,
  formatInitials,
  formatPhoneNumber
} from '../formatting';

describe('Formatting Utilities', () => {
  describe('formatDate', () => {
    it('should format dates correctly', () => {
      const date = new Date('2023-01-15');
      expect(formatDate(date)).toBe('January 15, 2023');
    });

    it('should format dates with custom options', () => {
      const date = new Date('2023-01-15');
      const result = formatDate(date, { year: 'numeric', month: 'short' });
      expect(result).toBe('Jan 2023');
    });
  });

  describe('formatTime', () => {
    it('should format time correctly', () => {
      const date = new Date('2023-01-15T14:30:00');
      expect(formatTime(date)).toBe('2:30 PM');
    });
  });

  describe('formatRelativeTime', () => {
    it('should format relative time correctly', () => {
      const now = new Date();
      const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      expect(formatRelativeTime(oneMinuteAgo)).toBe('1 minute ago');
      expect(formatRelativeTime(oneHourAgo)).toBe('1 hour ago');
      expect(formatRelativeTime(oneDayAgo)).toBe('1 day ago');
    });
  });

  describe('formatNumber', () => {
    it('should format numbers correctly', () => {
      expect(formatNumber(1234.56)).toBe('1,234.56');
      expect(formatNumber(1000)).toBe('1,000');
    });

    it('should format numbers with custom options', () => {
      expect(formatNumber(1234.56, { maximumFractionDigits: 0 })).toBe('1,235');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(1234.56, 'EUR')).toBe('€1,234.56');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentages correctly', () => {
      expect(formatPercentage(0.1234)).toBe('12.3%');
      expect(formatPercentage(0.1234, 2)).toBe('12.34%');
    });
  });

  describe('formatFileSize', () => {
    it('should format file sizes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
    });
  });

  describe('formatDuration', () => {
    it('should format durations correctly', () => {
      expect(formatDuration(65)).toBe('1:05');
      expect(formatDuration(3665)).toBe('1:01:05');
      expect(formatDuration(30)).toBe('0:30');
    });
  });

  describe('capitalize', () => {
    it('should capitalize text correctly', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('HELLO')).toBe('Hello');
      expect(capitalize('hELLO')).toBe('Hello');
    });
  });

  describe('capitalizeWords', () => {
    it('should capitalize words correctly', () => {
      expect(capitalizeWords('hello world')).toBe('Hello World');
      expect(capitalizeWords('HELLO WORLD')).toBe('Hello World');
      expect(capitalizeWords('hELLO wORLD')).toBe('Hello World');
    });
  });

  describe('truncateText', () => {
    it('should truncate text correctly', () => {
      expect(truncateText('Hello world', 5)).toBe('He...');
      expect(truncateText('Hello world', 5, '...')).toBe('He...');
      expect(truncateText('Hello world', 5, '***')).toBe('He***');
      expect(truncateText('Hello', 10)).toBe('Hello');
    });
  });

  describe('slugify', () => {
    it('should slugify text correctly', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Hello, World!')).toBe('hello-world');
      expect(slugify('Hello---World')).toBe('hello-world');
      expect(slugify('  Hello World  ')).toBe('hello-world');
    });
  });

  describe('formatFullName', () => {
    it('should format full names correctly', () => {
      expect(formatFullName('John', 'Doe')).toBe('John Doe');
      expect(formatFullName('  John  ', '  Doe  ')).toBe('John Doe');
    });
  });

  describe('formatInitials', () => {
    it('should format initials correctly', () => {
      expect(formatInitials('John', 'Doe')).toBe('JD');
      expect(formatInitials('Mary', 'Jane')).toBe('MJ');
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format phone numbers correctly', () => {
      expect(formatPhoneNumber('1234567890')).toBe('(123) 456-7890');
      expect(formatPhoneNumber('11234567890')).toBe('+1 (123) 456-7890');
      expect(formatPhoneNumber('123-456-7890')).toBe('(123) 456-7890');
    });
  });
});
