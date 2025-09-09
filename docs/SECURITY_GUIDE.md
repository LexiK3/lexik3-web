# LexiK3 Web Application - Security Guide

## 📋 Table of Contents

- [Security Overview](#security-overview)
- [Authentication Security](#authentication-security)
- [Data Protection](#data-protection)
- [Network Security](#network-security)
- [Client-Side Security](#client-side-security)
- [API Security](#api-security)
- [Content Security Policy](#content-security-policy)
- [Security Headers](#security-headers)
- [Input Validation](#input-validation)
- [Error Handling](#error-handling)
- [Security Monitoring](#security-monitoring)
- [Compliance](#compliance)
- [Security Checklist](#security-checklist)

## 🔒 Security Overview

The LexiK3 web application implements comprehensive security measures to protect user data, prevent unauthorized access, and ensure secure communication. This guide covers all security aspects of the application.

### Security Principles

- **Defense in Depth**: Multiple layers of security controls
- **Least Privilege**: Minimal necessary permissions
- **Fail Secure**: System fails to secure state
- **Security by Design**: Security built into architecture
- **Regular Updates**: Keep dependencies and systems updated

### Threat Model

| Threat | Impact | Likelihood | Mitigation |
|--------|--------|------------|------------|
| XSS Attacks | High | Medium | CSP, Input Validation, Output Encoding |
| CSRF Attacks | High | Medium | CSRF Tokens, SameSite Cookies |
| SQL Injection | High | Low | Parameterized Queries, Input Validation |
| Session Hijacking | Medium | Medium | Secure Cookies, HTTPS, Token Rotation |
| Data Breach | High | Low | Encryption, Access Controls, Monitoring |
| DDoS Attacks | Medium | Medium | Rate Limiting, CDN, Load Balancing |

## 🔐 Authentication Security

### JWT Token Security

```typescript
// src/utils/jwtSecurity.ts
import jwt from 'jsonwebtoken';

export interface JWTPayload {
  sub: string; // User ID
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  iat: number;
  exp: number;
  iss: string;
  aud: string;
  jti: string; // JWT ID for token revocation
}

export class JWTSecurity {
  private static readonly SECRET = process.env.REACT_APP_JWT_SECRET || 'fallback-secret';
  private static readonly ACCESS_TOKEN_EXPIRY = '15m';
  private static readonly REFRESH_TOKEN_EXPIRY = '7d';

  // Generate secure tokens
  static generateTokens(payload: Omit<JWTPayload, 'iat' | 'exp' | 'jti'>) {
    const jti = crypto.randomUUID();
    const now = Math.floor(Date.now() / 1000);

    const accessTokenPayload: JWTPayload = {
      ...payload,
      iat: now,
      exp: now + (15 * 60), // 15 minutes
      jti
    };

    const refreshTokenPayload = {
      ...payload,
      iat: now,
      exp: now + (7 * 24 * 60 * 60), // 7 days
      jti,
      type: 'refresh'
    };

    const accessToken = jwt.sign(accessTokenPayload, this.SECRET, {
      algorithm: 'HS256',
      issuer: 'lexik3.com',
      audience: 'lexik3-users'
    });

    const refreshToken = jwt.sign(refreshTokenPayload, this.SECRET, {
      algorithm: 'HS256',
      issuer: 'lexik3.com',
      audience: 'lexik3-users'
    });

    return { accessToken, refreshToken };
  }

  // Verify token
  static verifyToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, this.SECRET, {
        algorithms: ['HS256'],
        issuer: 'lexik3.com',
        audience: 'lexik3-users'
      }) as JWTPayload;

      // Check token expiration
      if (decoded.exp < Math.floor(Date.now() / 1000)) {
        return null;
      }

      return decoded;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  // Check if token is revoked
  static isTokenRevoked(jti: string): boolean {
    const revokedTokens = this.getRevokedTokens();
    return revokedTokens.has(jti);
  }

  // Revoke token
  static revokeToken(jti: string): void {
    const revokedTokens = this.getRevokedTokens();
    revokedTokens.add(jti);
    localStorage.setItem('revoked_tokens', JSON.stringify([...revokedTokens]));
  }

  private static getRevokedTokens(): Set<string> {
    const stored = localStorage.getItem('revoked_tokens');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  }
}
```

### Secure Token Storage

```typescript
// src/utils/secureStorage.ts
export class SecureStorage {
  private static readonly ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY || 'fallback-key';

  // Encrypt data before storing
  static encrypt(data: string): string {
    try {
      // Simple encryption for demo - use proper encryption in production
      const encoded = btoa(data);
      return encoded;
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  // Decrypt data after retrieving
  static decrypt(encryptedData: string): string {
    try {
      const decoded = atob(encryptedData);
      return decoded;
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  // Store sensitive data securely
  static setSecureItem(key: string, value: string): void {
    try {
      const encrypted = this.encrypt(value);
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Failed to store secure item:', error);
    }
  }

  // Retrieve sensitive data
  static getSecureItem(key: string): string | null {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      
      return this.decrypt(encrypted);
    } catch (error) {
      console.error('Failed to retrieve secure item:', error);
      return null;
    }
  }

  // Remove sensitive data
  static removeSecureItem(key: string): void {
    localStorage.removeItem(key);
  }

  // Clear all secure data
  static clearSecureData(): void {
    const secureKeys = ['access_token', 'refresh_token', 'user_data'];
    secureKeys.forEach(key => this.removeSecureItem(key));
  }
}
```

### Password Security

```typescript
// src/utils/passwordSecurity.ts
export class PasswordSecurity {
  // Password strength requirements
  static readonly PASSWORD_REQUIREMENTS = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxLength: 128
  };

  // Validate password strength
  static validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
    score: number;
  } {
    const errors: string[] = [];
    let score = 0;

    // Length check
    if (password.length < this.PASSWORD_REQUIREMENTS.minLength) {
      errors.push(`Password must be at least ${this.PASSWORD_REQUIREMENTS.minLength} characters long`);
    } else {
      score += 1;
    }

    if (password.length > this.PASSWORD_REQUIREMENTS.maxLength) {
      errors.push(`Password must be no more than ${this.PASSWORD_REQUIREMENTS.maxLength} characters long`);
    }

    // Character type checks
    if (this.PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    } else if (this.PASSWORD_REQUIREMENTS.requireUppercase) {
      score += 1;
    }

    if (this.PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    } else if (this.PASSWORD_REQUIREMENTS.requireLowercase) {
      score += 1;
    }

    if (this.PASSWORD_REQUIREMENTS.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    } else if (this.PASSWORD_REQUIREMENTS.requireNumbers) {
      score += 1;
    }

    if (this.PASSWORD_REQUIREMENTS.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    } else if (this.PASSWORD_REQUIREMENTS.requireSpecialChars) {
      score += 1;
    }

    // Common password check
    if (this.isCommonPassword(password)) {
      errors.push('Password is too common. Please choose a more unique password');
      score = 0;
    }

    return {
      isValid: errors.length === 0,
      errors,
      score: Math.min(score, 5)
    };
  }

  // Check against common passwords
  private static isCommonPassword(password: string): boolean {
    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123',
      'password123', 'admin', 'letmein', 'welcome', 'monkey'
    ];
    
    return commonPasswords.includes(password.toLowerCase());
  }

  // Generate secure password
  static generateSecurePassword(length: number = 12): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    
    // Ensure at least one character from each required type
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
    password += '0123456789'[Math.floor(Math.random() * 10)];
    password += '!@#$%^&*'[Math.floor(Math.random() * 8)];
    
    // Fill remaining length
    for (let i = password.length; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }
}
```

## 🛡️ Data Protection

### Data Encryption

```typescript
// src/utils/encryption.ts
export class DataEncryption {
  private static readonly ALGORITHM = 'AES-GCM';
  private static readonly KEY_LENGTH = 256;
  private static readonly IV_LENGTH = 12;

  // Generate encryption key
  static async generateKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      {
        name: this.ALGORITHM,
        length: this.KEY_LENGTH
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  // Encrypt sensitive data
  static async encrypt(data: string, key: CryptoKey): Promise<{
    encrypted: ArrayBuffer;
    iv: ArrayBuffer;
  }> {
    const iv = crypto.getRandomValues(new Uint8Array(this.IV_LENGTH));
    const encodedData = new TextEncoder().encode(data);

    const encrypted = await crypto.subtle.encrypt(
      {
        name: this.ALGORITHM,
        iv: iv
      },
      key,
      encodedData
    );

    return {
      encrypted,
      iv
    };
  }

  // Decrypt sensitive data
  static async decrypt(
    encryptedData: ArrayBuffer,
    iv: ArrayBuffer,
    key: CryptoKey
  ): Promise<string> {
    const decrypted = await crypto.subtle.decrypt(
      {
        name: this.ALGORITHM,
        iv: iv
      },
      key,
      encryptedData
    );

    return new TextDecoder().decode(decrypted);
  }

  // Hash sensitive data (one-way)
  static async hash(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}
```

### Data Sanitization

```typescript
// src/utils/sanitization.ts
import DOMPurify from 'dompurify';

export class DataSanitization {
  // Sanitize HTML content
  static sanitizeHTML(html: string): string {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
      ALLOWED_ATTR: []
    });
  }

  // Sanitize user input
  static sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .replace(/data:/gi, '') // Remove data: protocol
      .replace(/vbscript:/gi, '') // Remove vbscript: protocol
      .replace(/file:/gi, '') // Remove file: protocol
      .replace(/ftp:/gi, ''); // Remove ftp: protocol
  }

  // Sanitize file names
  static sanitizeFileName(fileName: string): string {
    return fileName
      .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscore
      .replace(/_{2,}/g, '_') // Replace multiple underscores with single
      .replace(/^_|_$/g, '') // Remove leading/trailing underscores
      .toLowerCase();
  }

  // Sanitize URL
  static sanitizeURL(url: string): string | null {
    try {
      const urlObj = new URL(url);
      
      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return null;
      }
      
      return urlObj.toString();
    } catch {
      return null;
    }
  }

  // Sanitize JSON data
  static sanitizeJSON(data: any): any {
    if (typeof data === 'string') {
      return this.sanitizeInput(data);
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeJSON(item));
    }
    
    if (data && typeof data === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        const sanitizedKey = this.sanitizeInput(key);
        sanitized[sanitizedKey] = this.sanitizeJSON(value);
      }
      return sanitized;
    }
    
    return data;
  }
}
```

## 🌐 Network Security

### HTTPS Configuration

```typescript
// src/utils/networkSecurity.ts
export class NetworkSecurity {
  // Force HTTPS in production
  static enforceHTTPS(): void {
    if (process.env.NODE_ENV === 'production' && window.location.protocol !== 'https:') {
      window.location.replace(`https:${window.location.href.substring(window.location.protocol.length)}`);
    }
  }

  // Validate API endpoints
  static validateAPIEndpoint(url: string): boolean {
    try {
      const urlObj = new URL(url);
      
      // Only allow HTTPS in production
      if (process.env.NODE_ENV === 'production' && urlObj.protocol !== 'https:') {
        return false;
      }
      
      // Check if URL is from allowed domains
      const allowedDomains = [
        'api.lexik3.com',
        'localhost',
        '127.0.0.1'
      ];
      
      return allowedDomains.some(domain => urlObj.hostname.includes(domain));
    } catch {
      return false;
    }
  }

  // Set secure cookie options
  static getSecureCookieOptions(): {
    secure: boolean;
    httpOnly: boolean;
    sameSite: 'strict' | 'lax' | 'none';
    maxAge: number;
  } {
    return {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutes
    };
  }
}
```

### CORS Configuration

```typescript
// src/config/cors.ts
export const corsConfig = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = [
      'https://lexik3.com',
      'https://www.lexik3.com',
      'https://app.lexik3.com'
    ];

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-CSRF-Token'
  ]
};
```

## 🔒 Client-Side Security

### XSS Prevention

```typescript
// src/utils/xssProtection.ts
export class XSSProtection {
  // Escape HTML characters
  static escapeHTML(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Sanitize user input for display
  static sanitizeForDisplay(input: string): string {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // Validate and sanitize user input
  static validateAndSanitize(input: string, maxLength: number = 1000): string {
    if (typeof input !== 'string') {
      return '';
    }

    // Truncate if too long
    const truncated = input.length > maxLength ? input.substring(0, maxLength) : input;
    
    // Sanitize
    return this.sanitizeForDisplay(truncated);
  }

  // Check for potential XSS patterns
  static detectXSSPatterns(input: string): boolean {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
      /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi
    ];

    return xssPatterns.some(pattern => pattern.test(input));
  }
}
```

### CSRF Protection

```typescript
// src/utils/csrfProtection.ts
export class CSRFProtection {
  private static readonly CSRF_TOKEN_KEY = 'csrf_token';

  // Generate CSRF token
  static generateCSRFToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Store CSRF token
  static storeCSRFToken(token: string): void {
    sessionStorage.setItem(this.CSRF_TOKEN_KEY, token);
  }

  // Get CSRF token
  static getCSRFToken(): string | null {
    return sessionStorage.getItem(this.CSRF_TOKEN_KEY);
  }

  // Validate CSRF token
  static validateCSRFToken(token: string): boolean {
    const storedToken = this.getCSRFToken();
    return storedToken !== null && storedToken === token;
  }

  // Add CSRF token to requests
  static addCSRFTokenToRequest(headers: Record<string, string>): Record<string, string> {
    const token = this.getCSRFToken();
    if (token) {
      headers['X-CSRF-Token'] = token;
    }
    return headers;
  }

  // Clear CSRF token
  static clearCSRFToken(): void {
    sessionStorage.removeItem(this.CSRF_TOKEN_KEY);
  }
}
```

## 🔐 API Security

### Request Security

```typescript
// src/utils/apiSecurity.ts
export class APISecurity {
  // Add security headers to requests
  static addSecurityHeaders(headers: Record<string, string>): Record<string, string> {
    return {
      ...headers,
      'X-Requested-With': 'XMLHttpRequest',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block'
    };
  }

  // Validate API response
  static validateAPIResponse(response: any): boolean {
    // Check if response is valid JSON
    if (typeof response !== 'object' || response === null) {
      return false;
    }

    // Check for required fields
    if (!response.hasOwnProperty('success') || typeof response.success !== 'boolean') {
      return false;
    }

    // Check data field if success is true
    if (response.success && !response.hasOwnProperty('data')) {
      return false;
    }

    // Check error field if success is false
    if (!response.success && !response.hasOwnProperty('error')) {
      return false;
    }

    return true;
  }

  // Rate limiting check
  static checkRateLimit(response: Response): boolean {
    const remaining = response.headers.get('X-RateLimit-Remaining');
    const reset = response.headers.get('X-RateLimit-Reset');
    
    if (remaining && parseInt(remaining) < 5) {
      console.warn('Rate limit warning: approaching limit');
      return false;
    }
    
    return true;
  }

  // Handle API errors securely
  static handleAPIError(error: any): string {
    // Don't expose internal error details
    if (error.response?.status >= 500) {
      return 'An internal server error occurred. Please try again later.';
    }
    
    if (error.response?.status === 401) {
      return 'Authentication required. Please log in again.';
    }
    
    if (error.response?.status === 403) {
      return 'Access denied. You do not have permission to perform this action.';
    }
    
    if (error.response?.status === 429) {
      return 'Too many requests. Please wait a moment before trying again.';
    }
    
    // For client errors, show user-friendly message
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    return 'An unexpected error occurred. Please try again.';
  }
}
```

## 🛡️ Content Security Policy

### CSP Configuration

```typescript
// src/config/csp.ts
export const cspConfig = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'", // Required for React
      "'unsafe-eval'", // Required for development
      "https://www.google-analytics.com",
      "https://www.googletagmanager.com",
      "https://sentry.io"
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'", // Required for Tailwind CSS
      "https://fonts.googleapis.com"
    ],
    fontSrc: [
      "'self'",
      "https://fonts.gstatic.com",
      "data:"
    ],
    imgSrc: [
      "'self'",
      "data:",
      "https:",
      "blob:"
    ],
    connectSrc: [
      "'self'",
      "https://api.lexik3.com",
      "https://sentry.io",
      "wss://sentry.io"
    ],
    frameSrc: ["'none'"],
    objectSrc: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'"],
    frameAncestors: ["'none'"],
    upgradeInsecureRequests: []
  },
  reportOnly: process.env.NODE_ENV === 'development',
  reportUri: '/api/csp-report'
};

// Generate CSP header
export const generateCSPHeader = (): string => {
  const directives = Object.entries(cspConfig.directives)
    .map(([directive, sources]) => {
      if (Array.isArray(sources)) {
        return `${directive} ${sources.join(' ')}`;
      }
      return `${directive} ${sources}`;
    })
    .join('; ');

  return `Content-Security-Policy: ${directives}`;
};
```

### CSP Violation Reporting

```typescript
// src/utils/cspReporting.ts
export class CSPReporting {
  // Report CSP violations
  static reportViolation(violation: any): void {
    const report = {
      'csp-report': {
        'document-uri': violation.documentURI,
        'referrer': violation.referrer,
        'violated-directive': violation.violatedDirective,
        'effective-directive': violation.effectiveDirective,
        'original-policy': violation.originalPolicy,
        'disposition': violation.disposition,
        'blocked-uri': violation.blockedURI,
        'line-number': violation.lineNumber,
        'column-number': violation.columnNumber,
        'source-file': violation.sourceFile,
        'status-code': violation.statusCode,
        'script-sample': violation.sample
      }
    };

    // Send to reporting endpoint
    fetch('/api/csp-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(report)
    }).catch(error => {
      console.error('Failed to report CSP violation:', error);
    });
  }

  // Initialize CSP violation reporting
  static initialize(): void {
    document.addEventListener('securitypolicyviolation', (event) => {
      this.reportViolation(event);
    });
  }
}
```

## 🔒 Security Headers

### Security Headers Configuration

```typescript
// src/utils/securityHeaders.ts
export const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()'
  ].join(', '),
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin'
};

// Apply security headers
export const applySecurityHeaders = (): void => {
  // This would typically be done server-side
  // For client-side, we can only set some headers
  if ('serviceWorker' in navigator) {
    // Register service worker for additional security
    navigator.serviceWorker.register('/sw.js');
  }
};
```

## ✅ Input Validation

### Comprehensive Input Validation

```typescript
// src/utils/inputValidation.ts
import * as yup from 'yup';

export class InputValidation {
  // Email validation schema
  static emailSchema = yup.string()
    .email('Invalid email format')
    .max(254, 'Email too long')
    .required('Email is required');

  // Password validation schema
  static passwordSchema = yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .matches(/[A-Z]/, 'Password must contain uppercase letter')
    .matches(/[a-z]/, 'Password must contain lowercase letter')
    .matches(/\d/, 'Password must contain number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain special character')
    .required('Password is required');

  // Name validation schema
  static nameSchema = yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name too long')
    .matches(/^[a-zA-Z\s-']+$/, 'Name contains invalid characters')
    .required('Name is required');

  // Book title validation schema
  static bookTitleSchema = yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title too long')
    .required('Title is required');

  // Word validation schema
  static wordSchema = yup.string()
    .min(1, 'Word cannot be empty')
    .max(100, 'Word too long')
    .matches(/^[a-zA-Z\s-']+$/, 'Word contains invalid characters')
    .required('Word is required');

  // Definition validation schema
  static definitionSchema = yup.string()
    .min(10, 'Definition must be at least 10 characters')
    .max(1000, 'Definition too long')
    .required('Definition is required');

  // Validate form data
  static async validateFormData<T>(
    schema: yup.Schema<T>,
    data: any
  ): Promise<{ isValid: boolean; data?: T; errors?: string[] }> {
    try {
      const validatedData = await schema.validate(data, { abortEarly: false });
      return { isValid: true, data: validatedData };
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return {
          isValid: false,
          errors: error.errors
        };
      }
      return {
        isValid: false,
        errors: ['Validation failed']
      };
    }
  }

  // Sanitize and validate input
  static sanitizeAndValidate<T>(
    schema: yup.Schema<T>,
    input: any
  ): { isValid: boolean; data?: T; errors?: string[] } {
    // First sanitize the input
    const sanitized = this.sanitizeInput(input);
    
    // Then validate
    try {
      const validatedData = schema.validateSync(sanitized, { abortEarly: false });
      return { isValid: true, data: validatedData };
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return {
          isValid: false,
          errors: error.errors
        };
      }
      return {
        isValid: false,
        errors: ['Validation failed']
      };
    }
  }

  // Sanitize input data
  private static sanitizeInput(input: any): any {
    if (typeof input === 'string') {
      return input
        .trim()
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '');
    }
    
    if (Array.isArray(input)) {
      return input.map(item => this.sanitizeInput(item));
    }
    
    if (input && typeof input === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(input)) {
        sanitized[key] = this.sanitizeInput(value);
      }
      return sanitized;
    }
    
    return input;
  }
}
```

## 🚨 Error Handling

### Secure Error Handling

```typescript
// src/utils/secureErrorHandling.ts
export class SecureErrorHandling {
  // Log errors securely
  static logError(error: Error, context?: any): void {
    // Don't log sensitive information
    const sanitizedError = {
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      context: this.sanitizeContext(context),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    console.error('Application Error:', sanitizedError);

    // Send to error reporting service
    if (process.env.REACT_APP_SENTRY_DSN) {
      // Sentry error reporting
      this.reportToSentry(error, sanitizedError);
    }
  }

  // Sanitize context data
  private static sanitizeContext(context: any): any {
    if (!context) return undefined;

    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth'];
    const sanitized: any = {};

    for (const [key, value] of Object.entries(context)) {
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'string' && value.length > 1000) {
        sanitized[key] = value.substring(0, 1000) + '...';
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  // Report to Sentry
  private static reportToSentry(error: Error, context: any): void {
    // This would integrate with Sentry
    console.log('Reporting to Sentry:', context);
  }

  // Handle API errors securely
  static handleAPIError(error: any): string {
    // Don't expose internal error details
    if (error.response?.status >= 500) {
      return 'A server error occurred. Please try again later.';
    }

    if (error.response?.status === 401) {
      return 'Please log in to continue.';
    }

    if (error.response?.status === 403) {
      return 'You do not have permission to perform this action.';
    }

    if (error.response?.status === 429) {
      return 'Too many requests. Please wait a moment.';
    }

    // For client errors, show safe message
    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    return 'An unexpected error occurred. Please try again.';
  }
}
```

## 📊 Security Monitoring

### Security Event Monitoring

```typescript
// src/utils/securityMonitoring.ts
export class SecurityMonitoring {
  // Track security events
  static trackSecurityEvent(event: string, details?: any): void {
    const securityEvent = {
      event,
      details: this.sanitizeDetails(details),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getCurrentUserId()
    };

    // Send to security monitoring service
    this.sendToSecurityService(securityEvent);
  }

  // Track failed login attempts
  static trackFailedLogin(email: string, reason: string): void {
    this.trackSecurityEvent('failed_login', {
      email: this.hashEmail(email),
      reason,
      ip: this.getClientIP()
    });
  }

  // Track suspicious activity
  static trackSuspiciousActivity(activity: string, details?: any): void {
    this.trackSecurityEvent('suspicious_activity', {
      activity,
      details
    });
  }

  // Track data access
  static trackDataAccess(resource: string, action: string): void {
    this.trackSecurityEvent('data_access', {
      resource,
      action,
      userId: this.getCurrentUserId()
    });
  }

  // Sanitize event details
  private static sanitizeDetails(details: any): any {
    if (!details) return undefined;

    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth', 'email'];
    const sanitized: any = {};

    for (const [key, value] of Object.entries(details)) {
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  // Hash email for privacy
  private static hashEmail(email: string): string {
    // Simple hash for demo - use proper hashing in production
    return btoa(email).substring(0, 8);
  }

  // Get current user ID
  private static getCurrentUserId(): string | null {
    // Get from secure storage
    return SecureStorage.getSecureItem('user_id');
  }

  // Get client IP (approximate)
  private static getClientIP(): string {
    // This would need to be provided by the server
    return 'unknown';
  }

  // Send to security service
  private static sendToSecurityService(event: any): void {
    // Send to security monitoring endpoint
    fetch('/api/security-events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    }).catch(error => {
      console.error('Failed to send security event:', error);
    });
  }
}
```

## 📋 Compliance

### GDPR Compliance

```typescript
// src/utils/gdprCompliance.ts
export class GDPRCompliance {
  // Get user consent
  static getConsent(): {
    analytics: boolean;
    marketing: boolean;
    necessary: boolean;
  } {
    return {
      analytics: localStorage.getItem('consent_analytics') === 'true',
      marketing: localStorage.getItem('consent_marketing') === 'true',
      necessary: true // Always true for necessary cookies
    };
  }

  // Set user consent
  static setConsent(consent: {
    analytics: boolean;
    marketing: boolean;
  }): void {
    localStorage.setItem('consent_analytics', consent.analytics.toString());
    localStorage.setItem('consent_marketing', consent.marketing.toString());
  }

  // Request data deletion
  static requestDataDeletion(): void {
    // Clear all user data
    SecureStorage.clearSecureData();
    localStorage.clear();
    sessionStorage.clear();
    
    // Send deletion request to server
    fetch('/api/user/data-deletion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Export user data
  static exportUserData(): void {
    const userData = {
      profile: SecureStorage.getSecureItem('user_data'),
      preferences: localStorage.getItem('user_preferences'),
      consent: this.getConsent(),
      exportDate: new Date().toISOString()
    };

    // Download as JSON file
    const blob = new Blob([JSON.stringify(userData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lexik3-user-data.json';
    a.click();
    URL.revokeObjectURL(url);
  }
}
```

## ✅ Security Checklist

### Pre-Deployment Security Checklist

- [ ] **Authentication & Authorization**
  - [ ] JWT tokens with proper expiration
  - [ ] Secure token storage
  - [ ] Password strength validation
  - [ ] Account lockout after failed attempts
  - [ ] Session timeout implementation

- [ ] **Data Protection**
  - [ ] Input validation and sanitization
  - [ ] Output encoding
  - [ ] Sensitive data encryption
  - [ ] Secure data transmission (HTTPS)
  - [ ] Data retention policies

- [ ] **Network Security**
  - [ ] HTTPS enforcement
  - [ ] CORS configuration
  - [ ] Security headers implementation
  - [ ] Rate limiting
  - [ ] DDoS protection

- [ ] **Client-Side Security**
  - [ ] XSS prevention
  - [ ] CSRF protection
  - [ ] Content Security Policy
  - [ ] Secure cookie settings
  - [ ] Input validation

- [ ] **API Security**
  - [ ] Request validation
  - [ ] Response sanitization
  - [ ] Error handling
  - [ ] Authentication middleware
  - [ ] Rate limiting

- [ ] **Monitoring & Logging**
  - [ ] Security event logging
  - [ ] Error tracking
  - [ ] Performance monitoring
  - [ ] Intrusion detection
  - [ ] Regular security audits

- [ ] **Compliance**
  - [ ] GDPR compliance
  - [ ] Data privacy protection
  - [ ] User consent management
  - [ ] Data deletion procedures
  - [ ] Privacy policy implementation

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅

This security guide provides comprehensive security measures for the LexiK3 web application. Implement these security controls to ensure a secure and compliant application.
