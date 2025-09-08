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
