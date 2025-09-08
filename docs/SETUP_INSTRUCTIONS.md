# LexiK3 Frontend Setup Instructions

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Project Setup](#project-setup)
- [Environment Configuration](#environment-configuration)
- [Development Workflow](#development-workflow)
- [Build and Deployment](#build-and-deployment)
- [Troubleshooting](#troubleshooting)
- [Development Tools](#development-tools)

## 🔧 Prerequisites

### Required Software

#### 1. Node.js and npm
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **yarn**: Version 1.22.0 or higher (optional, alternative to npm)

```bash
# Check versions
node --version
npm --version
yarn --version  # if using yarn
```

#### 2. Git
- **Git**: Version 2.30.0 or higher
- **GitHub CLI**: Optional but recommended

```bash
# Check version
git --version
```

#### 3. Code Editor
- **Visual Studio Code**: Recommended
- **Extensions**: See [Development Tools](#development-tools) section

#### 4. Backend API
- **LexiK3 Backend**: Must be running locally or accessible
- **Database**: PostgreSQL (handled by backend)

### System Requirements
- **RAM**: Minimum 8GB, Recommended 16GB
- **Storage**: At least 2GB free space
- **OS**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)

## 🚀 Project Setup

### 1. Clone Repository

```bash
# Clone the repository
git clone https://github.com/LexiK3/lexik3-frontend.git
cd lexik3-frontend

# Or if starting fresh
mkdir lexik3-frontend
cd lexik3-frontend
```

### 2. Initialize React Project

```bash
# Create React app with TypeScript
npx create-react-app . --template typescript

# Or using Vite (faster alternative)
npm create vite@latest . -- --template react-ts
```

### 3. Install Dependencies

```bash
# Core dependencies
npm install @reduxjs/toolkit react-redux
npm install react-router-dom
npm install axios
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install recharts
npm install react-hook-form
npm install @hookform/resolvers yup
npm install redux-persist

# Development dependencies
npm install -D @types/node
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D eslint-config-prettier prettier
npm install -D @testing-library/react @testing-library/jest-dom
npm install -D cypress
npm install -D @storybook/react @storybook/addon-essentials

# Optional: State management alternative
npm install zustand  # Alternative to Redux Toolkit

# Optional: UI library alternatives
npm install @headlessui/react @heroicons/react  # Alternative to Material-UI
npm install tailwindcss @tailwindcss/forms @tailwindcss/typography  # If using Tailwind
```

### 4. Project Structure Setup

```bash
# Create directory structure
mkdir -p src/{components,pages,services,store,types,utils,hooks,contexts}
mkdir -p src/components/{common,auth,learning,progress,layout}
mkdir -p src/services/{api,auth,learning,books,progress}
mkdir -p src/store/{slices,selectors,middleware,types}
mkdir -p public/{images,icons}
mkdir -p tests/{unit,integration,e2e}
```

### 5. Configuration Files

#### TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "es6"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": "src",
    "paths": {
      "@/*": ["*"],
      "@/components/*": ["components/*"],
      "@/services/*": ["services/*"],
      "@/store/*": ["store/*"],
      "@/types/*": ["types/*"],
      "@/utils/*": ["utils/*"],
      "@/hooks/*": ["hooks/*"]
    }
  },
  "include": [
    "src"
  ]
}
```

#### ESLint Configuration
```json
// .eslintrc.json
{
  "extends": [
    "react-app",
    "react-app/jest",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/exhaustive-deps": "warn",
    "prefer-const": "error",
    "no-var": "error"
  },
  "settings": {
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true
      }
    }
  }
}
```

#### Prettier Configuration
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

## ⚙️ Environment Configuration

### 1. Environment Variables

#### Development Environment
```bash
# .env.development
REACT_APP_API_URL=https://localhost:7001
REACT_APP_APP_NAME=LexiK3
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=development
REACT_APP_DEBUG=true
REACT_APP_SENTRY_DSN=
REACT_APP_ANALYTICS_ID=
```

#### Production Environment
```bash
# .env.production
REACT_APP_API_URL=https://api.lexik3.com/v1
REACT_APP_APP_NAME=LexiK3
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=production
REACT_APP_DEBUG=false
REACT_APP_SENTRY_DSN=your_sentry_dsn_here
REACT_APP_ANALYTICS_ID=your_analytics_id_here
```

#### Local Environment
```bash
# .env.local (gitignored)
REACT_APP_API_URL=http://localhost:7001
REACT_APP_DEBUG=true
REACT_APP_MOCK_API=false
```

### 2. Environment Setup Script

```bash
# scripts/setup-env.sh
#!/bin/bash

# Create environment files if they don't exist
if [ ! -f .env.development ]; then
  cp .env.example .env.development
  echo "Created .env.development from template"
fi

if [ ! -f .env.production ]; then
  cp .env.example .env.production
  echo "Created .env.production from template"
fi

# Set up git hooks
chmod +x scripts/pre-commit.sh
ln -sf ../../scripts/pre-commit.sh .git/hooks/pre-commit

echo "Environment setup complete!"
```

### 3. Package.json Scripts

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "format": "prettier --write src/**/*.{ts,tsx,css,md}",
    "type-check": "tsc --noEmit",
    "test:coverage": "react-scripts test --coverage --watchAll=false",
    "test:e2e": "cypress run",
    "test:e2e:open": "cypress open",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "analyze": "npm run build && npx source-map-explorer 'build/static/js/*.js'",
    "precommit": "npm run lint && npm run type-check && npm run test",
    "prepare": "husky install"
  }
}
```

## 💻 Development Workflow

### 1. Start Development Server

```bash
# Start the development server
npm start

# Or with specific environment
REACT_APP_API_URL=http://localhost:7001 npm start

# Start with mock data
REACT_APP_MOCK_API=true npm start
```

### 2. Backend Integration

#### Start Backend API
```bash
# In a separate terminal, start the backend
cd ../lexik3-backend
docker-compose up -d

# Or run directly
dotnet run --project src/LexiK3.Api
```

#### Verify API Connection
```bash
# Test API health
curl http://localhost:7001/health

# Test API endpoints
curl http://localhost:7001/api/books
```

### 3. Development Commands

```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type checking
npm run type-check

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e

# Open e2e test runner
npm run test:e2e:open
```

### 4. Git Workflow

```bash
# Create feature branch
git checkout -b feature/authentication-flow

# Make changes and commit
git add .
git commit -m "feat: implement user authentication flow"

# Push to remote
git push origin feature/authentication-flow

# Create pull request
gh pr create --title "Add authentication flow" --body "Implements user login/logout functionality"
```

## 🏗️ Build and Deployment

### 1. Production Build

```bash
# Create production build
npm run build

# Build with specific environment
REACT_APP_API_URL=https://api.lexik3.com/v1 npm run build

# Analyze bundle size
npm run analyze
```

### 2. Docker Setup

#### Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:80"
    environment:
      - REACT_APP_API_URL=http://backend:7001
    depends_on:
      - backend
    networks:
      - lexik3-network

  backend:
    image: lexik3-backend:latest
    ports:
      - "7001:8080"
    networks:
      - lexik3-network

networks:
  lexik3-network:
    driver: bridge
```

### 3. Deployment Options

#### Vercel Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables
vercel env add REACT_APP_API_URL
vercel env add REACT_APP_SENTRY_DSN
```

#### Netlify Deployment
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod

# Set environment variables in Netlify dashboard
```

#### AWS S3 + CloudFront
```bash
# Install AWS CLI
aws configure

# Build and upload
npm run build
aws s3 sync build/ s3://lexik3-frontend-bucket
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm start
```

#### 2. API Connection Issues
```bash
# Check if backend is running
curl http://localhost:7001/health

# Check CORS settings in backend
# Ensure CORS is configured for http://localhost:3000
```

#### 3. TypeScript Errors
```bash
# Clear TypeScript cache
rm -rf node_modules/.cache
npm run type-check

# Update types
npm update @types/react @types/react-dom
```

#### 4. Build Failures
```bash
# Clear all caches
rm -rf node_modules package-lock.json
npm install

# Clear React cache
rm -rf build
npm run build
```

#### 5. Test Failures
```bash
# Clear test cache
npm test -- --clearCache

# Run specific test
npm test -- --testNamePattern="Authentication"
```

### Debug Mode

```bash
# Enable React debugging
REACT_APP_DEBUG=true npm start

# Enable Redux DevTools
# Install Redux DevTools Extension in browser

# Enable network debugging
# Open browser DevTools > Network tab
```

## 🧪 Mock Service Implementation

### Overview

The LexiK3 frontend includes a comprehensive mock service implementation for testing and development purposes. This allows developers to work on the frontend without requiring a running backend API, enabling faster development cycles and more reliable testing.

### Mock Service Features

- **Complete API Simulation**: All endpoints from the API specification are implemented
- **Realistic Data**: Mock data that closely resembles production data structures
- **Configurable Responses**: Ability to simulate different scenarios (success, errors, edge cases)
- **State Persistence**: Mock data persists across browser sessions during development
- **Performance Simulation**: Configurable delays to simulate network latency
- **Error Simulation**: Built-in error scenarios for testing error handling

### Mock Service Structure

```
src/
├── services/
│   ├── api/
│   │   ├── mockApiClient.ts      # Mock API client implementation
│   │   ├── mockData/             # Mock data generators
│   │   │   ├── authMockData.ts
│   │   │   ├── booksMockData.ts
│   │   │   ├── learningMockData.ts
│   │   │   └── progressMockData.ts
│   │   └── mockEndpoints/        # Individual endpoint implementations
│   │       ├── authEndpoints.ts
│   │       ├── booksEndpoints.ts
│   │       ├── learningEndpoints.ts
│   │       └── progressEndpoints.ts
│   └── mockService.ts            # Main mock service orchestrator
```

### Environment Configuration

#### Enable Mock Service

```bash
# .env.development
REACT_APP_MOCK_API=true
REACT_APP_MOCK_DELAY=500
REACT_APP_MOCK_ERROR_RATE=0.1
```

#### Mock Service Configuration

```typescript
// src/services/mockService.ts
export interface MockServiceConfig {
  enabled: boolean;
  delay: number; // milliseconds
  errorRate: number; // 0-1, probability of errors
  persistData: boolean;
  scenarios: {
    networkSlow: boolean;
    serverErrors: boolean;
    authExpired: boolean;
  };
}

export const defaultMockConfig: MockServiceConfig = {
  enabled: process.env.REACT_APP_MOCK_API === 'true',
  delay: parseInt(process.env.REACT_APP_MOCK_DELAY || '500'),
  errorRate: parseFloat(process.env.REACT_APP_MOCK_ERROR_RATE || '0.1'),
  persistData: true,
  scenarios: {
    networkSlow: false,
    serverErrors: false,
    authExpired: false,
  },
};
```

### Mock Data Implementation

#### Authentication Mock Data

```typescript
// src/services/api/mockData/authMockData.ts
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../../../types/auth';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'demo@lexik3.com',
    firstName: 'Demo',
    lastName: 'User',
    createdAt: '2024-01-01T00:00:00Z',
    lastLoginAt: '2024-01-15T10:30:00Z',
    preferences: {
      language: 'en',
      dailyGoal: 20,
      notifications: true,
    },
  },
  {
    id: '2',
    email: 'test@lexik3.com',
    firstName: 'Test',
    lastName: 'User',
    createdAt: '2024-01-02T00:00:00Z',
    lastLoginAt: '2024-01-14T15:45:00Z',
    preferences: {
      language: 'es',
      dailyGoal: 15,
      notifications: false,
    },
  },
];

export const generateAuthResponse = (user: User): AuthResponse => ({
  token: `mock-jwt-token-${user.id}`,
  refreshToken: `mock-refresh-token-${user.id}`,
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  user,
});

export const validateLoginRequest = (request: LoginRequest): User | null => {
  return mockUsers.find(user => 
    user.email === request.email && 
    request.password === 'password123' // Mock password validation
  ) || null;
};

export const validateRegisterRequest = (request: RegisterRequest): boolean => {
  return request.password === request.confirmPassword && 
         request.password.length >= 8 &&
         !mockUsers.some(user => user.email === request.email);
};
```

#### Books Mock Data

```typescript
// src/services/api/mockData/booksMockData.ts
import { Book, BookDetail, BooksResponse, PaginationInfo } from '../../../types/books';

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'Essential English Vocabulary',
    description: 'Core vocabulary for everyday English communication',
    language: 'en',
    totalWords: 500,
    difficulty: 'beginner',
    createdAt: '2024-01-01T00:00:00Z',
    isPublic: true,
    author: 'LexiK3 Team',
    categories: ['general', 'beginner'],
    estimatedTime: '2 weeks',
    userProgress: {
      isEnrolled: true,
      wordsLearned: 150,
      currentStreak: 7,
      lastStudied: '2024-01-15T10:30:00Z',
    },
  },
  {
    id: '2',
    title: 'Business Spanish Vocabulary',
    description: 'Professional Spanish terms for business communication',
    language: 'es',
    totalWords: 300,
    difficulty: 'intermediate',
    createdAt: '2024-01-02T00:00:00Z',
    isPublic: true,
    author: 'LexiK3 Team',
    categories: ['business', 'intermediate'],
    estimatedTime: '3 weeks',
    userProgress: {
      isEnrolled: false,
      wordsLearned: 0,
      currentStreak: 0,
      lastStudied: null,
    },
  },
];

export const generateBooksResponse = (
  page: number = 1,
  pageSize: number = 10,
  filters?: any
): BooksResponse => {
  let filteredBooks = [...mockBooks];
  
  // Apply filters
  if (filters?.language) {
    filteredBooks = filteredBooks.filter(book => book.language === filters.language);
  }
  
  if (filters?.difficulty) {
    filteredBooks = filteredBooks.filter(book => book.difficulty === filters.difficulty);
  }
  
  if (filters?.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredBooks = filteredBooks.filter(book => 
      book.title.toLowerCase().includes(searchTerm) ||
      book.description.toLowerCase().includes(searchTerm)
    );
  }
  
  const totalItems = filteredBooks.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  const pagination: PaginationInfo = {
    page,
    pageSize,
    totalItems,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
  };
  
  return {
    books: filteredBooks.slice(startIndex, endIndex),
    pagination,
  };
};
```

### Mock API Client Implementation

```typescript
// src/services/api/mockApiClient.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { MockServiceConfig } from '../mockService';

export class MockApiClient {
  private config: MockServiceConfig;
  private mockData: Map<string, any> = new Map();

  constructor(config: MockServiceConfig) {
    this.config = config;
    this.initializeMockData();
  }

  private initializeMockData(): void {
    // Initialize with default mock data
    this.mockData.set('users', mockUsers);
    this.mockData.set('books', mockBooks);
    this.mockData.set('sessions', []);
    this.mockData.set('progress', mockProgress);
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.simulateRequest<T>('GET', url, undefined, config);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.simulateRequest<T>('POST', url, data, config);
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.simulateRequest<T>('PUT', url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.simulateRequest<T>('DELETE', url, undefined, config);
  }

  private async simulateRequest<T>(
    method: string,
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    // Simulate network delay
    await this.delay(this.config.delay);

    // Simulate random errors
    if (Math.random() < this.config.errorRate) {
      throw this.createMockError('NETWORK_ERROR', 'Simulated network error');
    }

    // Route to appropriate mock endpoint
    const response = await this.routeRequest(method, url, data);
    
    return {
      data: response,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: config || {},
    } as AxiosResponse<T>;
  }

  private async routeRequest(method: string, url: string, data?: any): Promise<any> {
    // Authentication endpoints
    if (url.includes('/api/auth/login')) {
      return this.handleLogin(data);
    }
    
    if (url.includes('/api/auth/register')) {
      return this.handleRegister(data);
    }
    
    if (url.includes('/api/auth/refresh')) {
      return this.handleRefreshToken(data);
    }
    
    if (url.includes('/api/auth/logout')) {
      return this.handleLogout();
    }

    // Books endpoints
    if (url.includes('/api/books') && method === 'GET') {
      return this.handleGetBooks(url);
    }
    
    if (url.includes('/api/books/') && method === 'GET') {
      return this.handleGetBookById(url);
    }

    // Learning endpoints
    if (url.includes('/api/learning-sessions') && method === 'POST') {
      return this.handleStartSession(data);
    }

    // Default response
    return { message: 'Mock endpoint not implemented' };
  }

  private handleLogin(data: any): any {
    const user = validateLoginRequest(data);
    if (!user) {
      throw this.createMockError('AUTHENTICATION_FAILED', 'Invalid credentials');
    }
    
    return {
      success: true,
      data: generateAuthResponse(user),
      message: 'Login successful',
      timestamp: new Date().toISOString(),
    };
  }

  private handleRegister(data: any): any {
    if (!validateRegisterRequest(data)) {
      throw this.createMockError('VALIDATION_ERROR', 'Invalid registration data');
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      createdAt: new Date().toISOString(),
      lastLoginAt: null,
      preferences: {
        language: 'en',
        dailyGoal: 20,
        notifications: true,
      },
    };
    
    this.mockData.set('users', [...this.mockData.get('users'), newUser]);
    
    return {
      success: true,
      data: {
        userId: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        emailConfirmed: false,
      },
      message: 'Registration successful',
      timestamp: new Date().toISOString(),
    };
  }

  private handleGetBooks(url: string): any {
    const urlObj = new URL(url, 'http://localhost');
    const page = parseInt(urlObj.searchParams.get('page') || '1');
    const pageSize = parseInt(urlObj.searchParams.get('pageSize') || '10');
    const language = urlObj.searchParams.get('language');
    const search = urlObj.searchParams.get('search');
    
    const filters = { language, search };
    const response = generateBooksResponse(page, pageSize, filters);
    
    return {
      success: true,
      data: response,
      message: 'Books retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  }

  private createMockError(code: string, message: string): Error {
    const error = new Error(message) as any;
    error.response = {
      data: {
        success: false,
        error: { code, message },
        timestamp: new Date().toISOString(),
      },
      status: 400,
    };
    return error;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### Service Integration

```typescript
// src/services/api/apiClient.ts
import axios, { AxiosInstance } from 'axios';
import { MockApiClient } from './mockApiClient';
import { mockServiceConfig } from '../mockService';

class ApiClient {
  private client: AxiosInstance | MockApiClient;

  constructor() {
    if (mockServiceConfig.enabled) {
      this.client = new MockApiClient(mockServiceConfig);
    } else {
      this.client = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }

  get<T>(url: string, config?: any) {
    return this.client.get<T>(url, config);
  }

  post<T>(url: string, data?: any, config?: any) {
    return this.client.post<T>(url, data, config);
  }

  put<T>(url: string, data?: any, config?: any) {
    return this.client.put<T>(url, data, config);
  }

  delete<T>(url: string, config?: any) {
    return this.client.delete<T>(url, config);
  }
}

export const apiClient = new ApiClient();
```

### Testing with Mock Service

#### Unit Tests

```typescript
// src/services/__tests__/authService.test.ts
import { AuthService } from '../auth/authService';
import { mockServiceConfig } from '../mockService';

// Enable mock service for tests
beforeAll(() => {
  mockServiceConfig.enabled = true;
  mockServiceConfig.errorRate = 0; // Disable random errors for tests
});

describe('AuthService with Mock API', () => {
  it('should login successfully with valid credentials', async () => {
    const credentials = {
      email: 'demo@lexik3.com',
      password: 'password123',
    };

    const result = await AuthService.login(credentials);
    
    expect(result.user.email).toBe('demo@lexik3.com');
    expect(result.token).toBeDefined();
    expect(result.isAuthenticated).toBe(true);
  });

  it('should fail login with invalid credentials', async () => {
    const credentials = {
      email: 'demo@lexik3.com',
      password: 'wrongpassword',
    };

    await expect(AuthService.login(credentials)).rejects.toThrow();
  });
});
```

#### Integration Tests

```typescript
// src/__tests__/integration/learningFlow.test.ts
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../store';
import LearningSession from '../../components/learning/LearningSession';
import { mockServiceConfig } from '../../services/mockService';

beforeAll(() => {
  mockServiceConfig.enabled = true;
  mockServiceConfig.delay = 0; // No delay for tests
});

describe('Learning Flow Integration', () => {
  it('should complete a learning session', async () => {
    render(
      <Provider store={store}>
        <LearningSession />
      </Provider>
    );

    // Start session
    const startButton = screen.getByText('Start Learning');
    startButton.click();

    await waitFor(() => {
      expect(screen.getByText('Word 1 of 10')).toBeInTheDocument();
    });

    // Submit answers
    const answerInput = screen.getByRole('textbox');
    answerInput.value = 'test answer';
    
    const submitButton = screen.getByText('Submit');
    submitButton.click();

    // Complete session
    await waitFor(() => {
      expect(screen.getByText('Session Complete!')).toBeInTheDocument();
    });
  });
});
```

## 🔄 Loading States & Error Handling

### Overview

The LexiK3 application includes comprehensive loading states and error handling components to provide a professional user experience. These components ensure users always have clear feedback about the application state.

### Available Components

#### 1. LoadingSpinner
- **Location**: `src/components/common/LoadingSpinner.tsx`
- **Purpose**: Displays loading indicators with customizable size and color
- **Usage**:
```typescript
import LoadingSpinner from '../components/common/LoadingSpinner';

// Basic usage
<LoadingSpinner />

// With custom props
<LoadingSpinner 
  size="lg" 
  color="primary" 
  text="Loading books..." 
/>
```

#### 2. ErrorMessage
- **Location**: `src/components/common/ErrorMessage.tsx`
- **Purpose**: Displays user-friendly error messages with retry/dismiss options
- **Usage**:
```typescript
import ErrorMessage from '../components/common/ErrorMessage';

<ErrorMessage
  error={error}
  onRetry={() => retryOperation()}
  onDismiss={() => clearError()}
  variant="error"
/>
```

#### 3. ErrorBoundary
- **Location**: `src/components/common/ErrorBoundary.tsx`
- **Purpose**: Catches React errors and displays fallback UI
- **Usage**:
```typescript
import ErrorBoundary from '../components/common/ErrorBoundary';

<ErrorBoundary onError={(error, errorInfo) => logError(error, errorInfo)}>
  <YourComponent />
</ErrorBoundary>
```

#### 4. LoadingCard
- **Location**: `src/components/common/LoadingCard.tsx`
- **Purpose**: Skeleton loading states for cards and content
- **Usage**:
```typescript
import LoadingCard from '../components/common/LoadingCard';

<LoadingCard 
  lines={3} 
  showImage={true} 
  showButton={true} 
/>
```

### Implementation in Pages

All major pages (Dashboard, Learning, Progress) now include:
- Loading states during API calls
- Error handling with retry functionality
- Empty states with helpful guidance
- Skeleton loading for better perceived performance

### Testing Loading States

```bash
# Test loading states
npm test -- --testPathPattern="LoadingSpinner|ErrorMessage"

# Test with slow network simulation
REACT_APP_MOCK_DELAY=3000 npm start
```

### Development Workflow

#### Starting with Mock Service

```bash
# Start development server with mock API
REACT_APP_MOCK_API=true npm start

# Start with specific mock configuration
REACT_APP_MOCK_API=true REACT_APP_MOCK_DELAY=1000 npm start

# Start with error simulation
REACT_APP_MOCK_API=true REACT_APP_MOCK_ERROR_RATE=0.3 npm start
```

#### Switching Between Mock and Real API

```typescript
// src/services/mockService.ts
export const toggleMockService = (enabled: boolean) => {
  mockServiceConfig.enabled = enabled;
  
  // Reload the page to reinitialize API client
  window.location.reload();
};

// Development helper
if (process.env.NODE_ENV === 'development') {
  (window as any).toggleMockService = toggleMockService;
}
```

### Mock Data Management

#### Adding New Mock Data

```typescript
// src/services/api/mockData/customMockData.ts
export const addMockBook = (book: Book) => {
  const books = mockData.get('books') || [];
  mockData.set('books', [...books, book]);
};

export const updateMockUserProgress = (userId: string, progress: UserProgress) => {
  const users = mockData.get('users') || [];
  const updatedUsers = users.map(user => 
    user.id === userId ? { ...user, progress } : user
  );
  mockData.set('users', updatedUsers);
};
```

#### Data Persistence

```typescript
// src/services/api/mockData/mockDataPersistence.ts
export const saveMockData = () => {
  const data = Object.fromEntries(mockData);
  localStorage.setItem('lexik3-mock-data', JSON.stringify(data));
};

export const loadMockData = () => {
  const saved = localStorage.getItem('lexik3-mock-data');
  if (saved) {
    const data = JSON.parse(saved);
    Object.entries(data).forEach(([key, value]) => {
      mockData.set(key, value);
    });
  }
};

// Auto-save on data changes
export const enableAutoSave = () => {
  const originalSet = mockData.set.bind(mockData);
  mockData.set = (key: string, value: any) => {
    originalSet(key, value);
    saveMockData();
  };
};
```

### Best Practices

1. **Keep Mock Data Realistic**: Use data that closely resembles production data
2. **Test Error Scenarios**: Include mock endpoints that return various error conditions
3. **Maintain Data Consistency**: Ensure relationships between mock data entities are valid
4. **Document Mock Scenarios**: Clearly document what each mock endpoint simulates
5. **Version Control Mock Data**: Include mock data in version control for consistency
6. **Performance Testing**: Use mock service to test performance with large datasets
7. **Edge Case Testing**: Include mock data that tests edge cases and boundary conditions

## 🛠️ Development Tools

### VS Code Extensions

#### Essential Extensions
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

#### React-Specific Extensions
```json
{
  "recommendations": [
    "dsznajder.es7-react-js-snippets",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### VS Code Settings

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

### Git Hooks

#### Pre-commit Hook
```bash
#!/bin/bash
# scripts/pre-commit.sh

echo "Running pre-commit checks..."

# Run linting
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ Linting failed"
  exit 1
fi

# Run type checking
npm run type-check
if [ $? -ne 0 ]; then
  echo "❌ Type checking failed"
  exit 1
fi

# Run tests
npm test -- --watchAll=false
if [ $? -ne 0 ]; then
  echo "❌ Tests failed"
  exit 1
fi

echo "✅ All checks passed"
exit 0
```

### Browser Extensions

#### Development Extensions
- **React Developer Tools**: Debug React components
- **Redux DevTools**: Debug Redux state
- **Apollo Client DevTools**: Debug GraphQL (if used)
- **Lighthouse**: Performance auditing
- **WAVE**: Accessibility testing

### Performance Monitoring

#### Bundle Analysis
```bash
# Analyze bundle size
npm run analyze

# Check for duplicate dependencies
npx npm-check-duplicates

# Check for outdated packages
npx npm-check-updates
```

#### Performance Testing
```bash
# Run Lighthouse audit
npx lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html

# Run WebPageTest
# Visit https://www.webpagetest.org/
```

## 📚 Additional Resources

### Documentation
- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Material-UI Documentation](https://mui.com/)
- [React Router Documentation](https://reactrouter.com/)

### Learning Resources
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Redux Style Guide](https://redux.js.org/style-guide/style-guide)
- [React Performance](https://reactjs.org/docs/optimizing-performance.html)

### Community
- [React Discord](https://discord.gg/react)
- [Redux Discord](https://discord.gg/redux)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/reactjs)

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Status**: Ready for Development ✅
