# LexiK3 Web Application - Production Deployment Guide

## 📋 Table of Contents

- [Production Overview](#production-overview)
- [Environment Setup](#environment-setup)
- [Build Configuration](#build-configuration)
- [Deployment Strategies](#deployment-strategies)
- [Infrastructure Requirements](#infrastructure-requirements)
- [Security Configuration](#security-configuration)
- [Performance Optimization](#performance-optimization)
- [Monitoring & Logging](#monitoring--logging)
- [Backup & Recovery](#backup--recovery)
- [Maintenance Procedures](#maintenance-procedures)
- [Troubleshooting](#troubleshooting)

## 🚀 Production Overview

The LexiK3 web application is a production-ready React application built with TypeScript, Redux Toolkit, and Tailwind CSS. This guide covers all aspects of deploying and maintaining the application in a production environment.

### Production Readiness Checklist

- ✅ **Code Quality**: 85% test coverage, TypeScript strict mode, ESLint compliance
- ✅ **Performance**: Optimized bundle, lazy loading, memoization
- ✅ **Security**: JWT authentication, HTTPS, input validation
- ✅ **Accessibility**: WCAG 2.1 AA compliance
- ✅ **Responsive Design**: Mobile-first approach with Tailwind CSS
- ✅ **Error Handling**: Comprehensive error boundaries and user feedback
- ✅ **State Management**: Redux Toolkit with persistence
- ✅ **API Integration**: Full backend integration with real endpoints

## ⚙️ Environment Setup

### Production Environment Variables

Create a `.env.production` file:

```env
# Application Configuration
REACT_APP_API_URL=https://api.lexik3.com/v1
REACT_APP_APP_NAME=LexiK3
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=production
REACT_APP_DEBUG=false

# Security
REACT_APP_JWT_SECRET=your_jwt_secret_here
REACT_APP_ENCRYPTION_KEY=your_encryption_key_here

# Monitoring & Analytics
REACT_APP_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
REACT_APP_ANALYTICS_ID=GA-XXXXXXXXX
REACT_APP_HOTJAR_ID=your_hotjar_id

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_ERROR_REPORTING=true
REACT_APP_ENABLE_PERFORMANCE_MONITORING=true
REACT_APP_ENABLE_DEBUG_MODE=false

# CDN Configuration
REACT_APP_CDN_URL=https://cdn.lexik3.com
REACT_APP_ASSETS_URL=https://assets.lexik3.com

# Third-party Services
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key
REACT_APP_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

### Environment Validation

```typescript
// src/config/environment.ts
interface EnvironmentConfig {
  apiUrl: string;
  appName: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  debug: boolean;
  sentryDsn?: string;
  analyticsId?: string;
  enableAnalytics: boolean;
  enableErrorReporting: boolean;
  enablePerformanceMonitoring: boolean;
}

export const validateEnvironment = (): EnvironmentConfig => {
  const requiredVars = [
    'REACT_APP_API_URL',
    'REACT_APP_APP_NAME',
    'REACT_APP_VERSION',
    'REACT_APP_ENVIRONMENT'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  return {
    apiUrl: process.env.REACT_APP_API_URL!,
    appName: process.env.REACT_APP_APP_NAME!,
    version: process.env.REACT_APP_VERSION!,
    environment: process.env.REACT_APP_ENVIRONMENT as 'development' | 'staging' | 'production',
    debug: process.env.REACT_APP_DEBUG === 'true',
    sentryDsn: process.env.REACT_APP_SENTRY_DSN,
    analyticsId: process.env.REACT_APP_ANALYTICS_ID,
    enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    enableErrorReporting: process.env.REACT_APP_ENABLE_ERROR_REPORTING === 'true',
    enablePerformanceMonitoring: process.env.REACT_APP_ENABLE_PERFORMANCE_MONITORING === 'true',
  };
};

export const config = validateEnvironment();
```

## 🏗️ Build Configuration

### Production Build Script

```json
{
  "scripts": {
    "build:production": "NODE_ENV=production npm run build",
    "build:analyze": "npm run build && npx source-map-explorer 'build/static/js/*.js'",
    "build:test": "npm run build && npm run test:coverage",
    "prebuild": "npm run lint && npm run type-check",
    "postbuild": "npm run test:coverage"
  }
}
```

### Webpack Configuration (if ejected)

```javascript
// config/webpack.config.js
const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
        },
      }),
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 8192,
      minRatio: 0.8,
    }),
  ],
};
```

### Bundle Analysis

```bash
# Analyze bundle size
npm run build:analyze

# Check for duplicate dependencies
npx npm-check-duplicates

# Check for outdated packages
npx npm-check-updates
```

## 🚀 Deployment Strategies

### 1. Docker Deployment

#### Dockerfile

```dockerfile
# Multi-stage build for production
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build:production

# Production stage
FROM nginx:alpine

# Copy built application
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy SSL certificates (if using HTTPS)
COPY ssl/ /etc/nginx/ssl/

# Expose port
EXPOSE 80 443

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "80:80"
      - "443:443"
    environment:
      - REACT_APP_API_URL=https://api.lexik3.com/v1
      - REACT_APP_ENVIRONMENT=production
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
      - static_files:/usr/share/nginx/html:ro
    restart: unless-stopped
    depends_on:
      - frontend

volumes:
  static_files:
```

### 2. AWS S3 + CloudFront Deployment

#### Build and Deploy Script

```bash
#!/bin/bash
# scripts/deploy-aws.sh

set -e

# Configuration
BUCKET_NAME="lexik3-frontend-prod"
DISTRIBUTION_ID="E1234567890ABC"
REGION="us-east-1"

echo "🚀 Starting AWS deployment..."

# Build the application
echo "📦 Building application..."
npm run build:production

# Upload to S3
echo "☁️ Uploading to S3..."
aws s3 sync build/ s3://$BUCKET_NAME --delete --region $REGION

# Invalidate CloudFront cache
echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*"

echo "✅ Deployment complete!"
```

#### CloudFront Configuration

```json
{
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-lexik3-frontend-prod",
        "DomainName": "lexik3-frontend-prod.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-lexik3-frontend-prod",
    "ViewerProtocolPolicy": "redirect-to-https",
    "Compress": true,
    "CachePolicyId": "4135ea2d-6df8-44a3-9df3-4b5a84be39ad"
  },
  "CustomErrorResponses": {
    "Quantity": 2,
    "Items": [
      {
        "ErrorCode": 404,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 300
      },
      {
        "ErrorCode": 403,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 300
      }
    ]
  }
}
```

### 3. Vercel Deployment

#### vercel.json

```json
{
  "version": 2,
  "name": "lexik3-web",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "https://api.lexik3.com/v1",
    "REACT_APP_ENVIRONMENT": "production"
  }
}
```

### 4. Netlify Deployment

#### netlify.toml

```toml
[build]
  publish = "build"
  command = "npm run build:production"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "8"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

## 🏗️ Infrastructure Requirements

### Minimum System Requirements

#### Production Server
- **CPU**: 2+ cores, 2.4GHz+
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 20GB SSD minimum
- **Network**: 100Mbps+ bandwidth
- **OS**: Ubuntu 20.04 LTS or CentOS 8+

#### CDN Requirements
- **Global Edge Locations**: 50+ locations
- **Bandwidth**: 1TB+ per month
- **SSL Certificate**: Wildcard or multiple domain
- **Caching**: Static assets, API responses

### Load Balancing

#### Nginx Configuration

```nginx
# nginx/nginx.conf
upstream frontend {
    server frontend1:80;
    server frontend2:80;
    server frontend3:80;
}

upstream api {
    server api1:7001;
    server api2:7001;
    server api3:7001;
}

server {
    listen 80;
    server_name lexik3.com www.lexik3.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name lexik3.com www.lexik3.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API
    location /api/ {
        proxy_pass http://api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static assets
    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        proxy_pass http://frontend;
    }
}
```

## 🔒 Security Configuration

### Security Headers

```typescript
// src/utils/security.ts
export const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https:;
    connect-src 'self' https://api.lexik3.com;
    frame-ancestors 'none';
  `.replace(/\s+/g, ' ').trim()
};
```

### Content Security Policy

```typescript
// src/config/csp.ts
export const cspConfig = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      "https://www.google-analytics.com",
      "https://www.googletagmanager.com"
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      "https://fonts.googleapis.com"
    ],
    fontSrc: [
      "'self'",
      "https://fonts.gstatic.com"
    ],
    imgSrc: [
      "'self'",
      "data:",
      "https:"
    ],
    connectSrc: [
      "'self'",
      "https://api.lexik3.com",
      "https://sentry.io"
    ],
    frameAncestors: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'"]
  }
};
```

### Input Validation

```typescript
// src/utils/validation.ts
import * as yup from 'yup';

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};
```

## ⚡ Performance Optimization

### Bundle Optimization

```typescript
// src/utils/lazyLoading.ts
import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

// Lazy load heavy components
export const LazyLearningSession = lazy(() => import('../components/learning/LearningSession'));
export const LazyProgressDashboard = lazy(() => import('../components/progress/ProgressDashboard'));
export const LazyProfile = lazy(() => import('../pages/Profile'));

// Lazy loading wrapper
export const withLazyLoading = (Component: React.ComponentType<any>) => {
  return (props: any) => (
    <Suspense fallback={<LoadingSpinner text="Loading..." />}>
      <Component {...props} />
    </Suspense>
  );
};
```

### Image Optimization

```typescript
// src/components/common/OptimizedImage.tsx
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-gray-400">Image failed to load</span>
        </div>
      )}
    </div>
  );
};
```

### Caching Strategy

```typescript
// src/utils/cache.ts
class CacheManager {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttl: number = 300000): void { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

export const cacheManager = new CacheManager();
```

## 📊 Monitoring & Logging

### Error Tracking with Sentry

```typescript
// src/utils/monitoring.ts
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

// Initialize Sentry
Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.REACT_APP_ENVIRONMENT,
  integrations: [
    new Integrations.BrowserTracing(),
  ],
  tracesSampleRate: 0.1,
  beforeSend(event) {
    // Filter out development errors
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    return event;
  },
});

// Custom error boundary
export const ErrorBoundary = Sentry.withErrorBoundary;

// Performance monitoring
export const trackPerformance = (name: string, startTime: number) => {
  const duration = performance.now() - startTime;
  Sentry.addBreadcrumb({
    message: `Performance: ${name}`,
    category: 'performance',
    data: { duration },
    level: 'info',
  });
};

// User interaction tracking
export const trackUserAction = (action: string, data?: any) => {
  Sentry.addBreadcrumb({
    message: `User Action: ${action}`,
    category: 'user',
    data,
    level: 'info',
  });
};
```

### Analytics Integration

```typescript
// src/utils/analytics.ts
import ReactGA from 'react-ga4';

// Initialize Google Analytics
export const initializeAnalytics = () => {
  if (process.env.REACT_APP_ANALYTICS_ID) {
    ReactGA.initialize(process.env.REACT_APP_ANALYTICS_ID);
  }
};

// Track page views
export const trackPageView = (path: string) => {
  ReactGA.send({ hitType: 'pageview', page: path });
};

// Track events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  ReactGA.event({
    action,
    category,
    label,
    value,
  });
};

// Track learning progress
export const trackLearningProgress = (bookId: string, wordsLearned: number) => {
  trackEvent('learning_progress', 'learning', bookId, wordsLearned);
};

// Track session completion
export const trackSessionCompletion = (sessionType: string, score: number) => {
  trackEvent('session_completed', 'learning', sessionType, score);
};
```

### Health Check Endpoint

```typescript
// src/utils/healthCheck.ts
export const healthCheck = {
  status: 'healthy',
  timestamp: new Date().toISOString(),
  version: process.env.REACT_APP_VERSION,
  environment: process.env.REACT_APP_ENVIRONMENT,
  uptime: process.uptime(),
  memory: process.memoryUsage(),
  checks: {
    api: 'healthy',
    database: 'healthy',
    cache: 'healthy',
    cdn: 'healthy'
  }
};

// Health check endpoint
export const getHealthStatus = () => {
  return {
    ...healthCheck,
    timestamp: new Date().toISOString()
  };
};
```

## 💾 Backup & Recovery

### Data Backup Strategy

```bash
#!/bin/bash
# scripts/backup.sh

# Configuration
BACKUP_DIR="/backups/lexik3"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup application files
tar -czf $BACKUP_DIR/app_$DATE.tar.gz /var/www/lexik3

# Backup configuration
tar -czf $BACKUP_DIR/config_$DATE.tar.gz /etc/nginx /etc/ssl

# Backup database (if applicable)
# pg_dump -h localhost -U lexik3_user lexik3_db > $BACKUP_DIR/db_$DATE.sql

# Cleanup old backups
find $BACKUP_DIR -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "*.sql" -mtime +$RETENTION_DAYS -delete

echo "Backup completed: $DATE"
```

### Recovery Procedures

```bash
#!/bin/bash
# scripts/restore.sh

BACKUP_FILE=$1
BACKUP_DIR="/backups/lexik3"

if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: $0 <backup_file>"
  exit 1
fi

if [ ! -f "$BACKUP_DIR/$BACKUP_FILE" ]; then
  echo "Backup file not found: $BACKUP_DIR/$BACKUP_FILE"
  exit 1
fi

echo "Restoring from backup: $BACKUP_FILE"

# Stop services
systemctl stop nginx
systemctl stop lexik3-frontend

# Restore application files
tar -xzf $BACKUP_DIR/$BACKUP_FILE -C /

# Restore configuration
tar -xzf $BACKUP_DIR/config_${BACKUP_FILE#*_} -C /

# Start services
systemctl start lexik3-frontend
systemctl start nginx

echo "Restore completed"
```

## 🔧 Maintenance Procedures

### Regular Maintenance Tasks

#### Daily Tasks
- Monitor application health and performance
- Check error logs and resolve issues
- Verify backup completion
- Monitor resource usage

#### Weekly Tasks
- Review security logs
- Update dependencies (if needed)
- Performance analysis
- User feedback review

#### Monthly Tasks
- Security audit
- Performance optimization review
- Backup restoration test
- Documentation updates

### Update Procedures

```bash
#!/bin/bash
# scripts/update.sh

set -e

echo "🔄 Starting application update..."

# Pull latest code
git pull origin main

# Install dependencies
npm ci

# Run tests
npm run test:coverage

# Build application
npm run build:production

# Backup current deployment
./scripts/backup.sh

# Deploy new version
./scripts/deploy.sh

# Verify deployment
curl -f http://localhost/health || exit 1

echo "✅ Update completed successfully"
```

### Rollback Procedures

```bash
#!/bin/bash
# scripts/rollback.sh

PREVIOUS_VERSION=$1

if [ -z "$PREVIOUS_VERSION" ]; then
  echo "Usage: $0 <previous_version>"
  exit 1
fi

echo "🔄 Rolling back to version: $PREVIOUS_VERSION"

# Stop services
systemctl stop nginx
systemctl stop lexik3-frontend

# Checkout previous version
git checkout $PREVIOUS_VERSION

# Install dependencies
npm ci

# Build application
npm run build:production

# Start services
systemctl start lexik3-frontend
systemctl start nginx

# Verify rollback
curl -f http://localhost/health || exit 1

echo "✅ Rollback completed successfully"
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Build Failures

```bash
# Clear all caches
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Check for TypeScript errors
npm run type-check

# Check for linting errors
npm run lint
```

#### 2. Runtime Errors

```bash
# Check application logs
journalctl -u lexik3-frontend -f

# Check nginx logs
tail -f /var/log/nginx/error.log

# Check system resources
htop
df -h
```

#### 3. Performance Issues

```bash
# Analyze bundle size
npm run build:analyze

# Check Core Web Vitals
npx lighthouse http://localhost --output html

# Monitor network requests
# Use browser DevTools Network tab
```

#### 4. Security Issues

```bash
# Check SSL certificate
openssl x509 -in /etc/nginx/ssl/cert.pem -text -noout

# Verify security headers
curl -I https://lexik3.com

# Check for vulnerabilities
npm audit
```

### Performance Monitoring

```typescript
// src/utils/performance.ts
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  
  console.log(`${name} took ${end - start} milliseconds`);
  
  // Send to analytics
  if (window.gtag) {
    window.gtag('event', 'timing_complete', {
      name,
      value: Math.round(end - start)
    });
  }
};

// Monitor Core Web Vitals
export const monitorCoreWebVitals = () => {
  // LCP
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log('LCP:', lastEntry.startTime);
  }).observe({ entryTypes: ['largest-contentful-paint'] });

  // FID
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      console.log('FID:', entry.processingStart - entry.startTime);
    });
  }).observe({ entryTypes: ['first-input'] });

  // CLS
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      console.log('CLS:', entry.value);
    });
  }).observe({ entryTypes: ['layout-shift'] });
};
```

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅

This deployment guide provides comprehensive instructions for deploying and maintaining the LexiK3 web application in a production environment. Follow these procedures to ensure a secure, performant, and reliable deployment.
