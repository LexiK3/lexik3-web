// config/environment.ts
export interface EnvironmentConfig {
  useMockApi: boolean;
  mockDelay: number;
  mockErrorRate: number;
  apiUrl: string;
  environment: string;
  debug: boolean;
  appName: string;
  version: string;
}

export const environmentConfig: EnvironmentConfig = {
  // Mock API Configuration
  useMockApi: process.env.REACT_APP_USE_MOCK_API === 'true',
  mockDelay: parseInt(process.env.REACT_APP_MOCK_DELAY || '500'),
  mockErrorRate: parseFloat(process.env.REACT_APP_MOCK_ERROR_RATE || '0.1'),
  
  // API Configuration
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5071',
  environment: process.env.REACT_APP_ENVIRONMENT || 'development',
  debug: process.env.REACT_APP_DEBUG === 'true' || process.env.NODE_ENV === 'development',
  
  // App Configuration
  appName: process.env.REACT_APP_APP_NAME || 'LexiK3',
  version: process.env.REACT_APP_VERSION || '1.0.0',
};

// Log configuration on startup
if (environmentConfig.debug) {
  console.log('🔧 Environment Configuration:', {
    useMockApi: environmentConfig.useMockApi,
    mockDelay: environmentConfig.mockDelay,
    mockErrorRate: environmentConfig.mockErrorRate,
    apiUrl: environmentConfig.apiUrl,
    environment: environmentConfig.environment,
  });
  
  if (environmentConfig.useMockApi) {
    console.log('🚫 Mock API Mode: No real API calls will be made');
  } else {
    console.log('🌐 Real API Mode: API calls will be made to:', environmentConfig.apiUrl);
  }
}
