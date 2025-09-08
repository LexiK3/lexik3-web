// services/api/apiServiceFactory.ts
import { AxiosInstance } from 'axios';
import { mockApiClient } from '../mock/mockApiClient';
import { apiClient } from './client';
import { environmentConfig } from '../../config/environment';

export interface ApiServiceConfig {
  useMockApi: boolean;
  mockDelay?: number;
  mockErrorRate?: number;
}

class ApiServiceFactory {
  private config: ApiServiceConfig;
  private client!: AxiosInstance | typeof mockApiClient;

  constructor() {
    this.config = {
      useMockApi: environmentConfig.useMockApi,
      mockDelay: environmentConfig.mockDelay,
      mockErrorRate: environmentConfig.mockErrorRate,
    };

    this.initializeClient();
  }

  private initializeClient(): void {
    if (this.config.useMockApi) {
      console.log('🔧 Using Mock API Client - No real API calls will be made');
      this.client = mockApiClient;
    } else {
      console.log('🌐 Using Real API Client - API calls will be made to:', process.env.REACT_APP_API_URL);
      this.client = apiClient;
    }
  }

  public getClient(): AxiosInstance | typeof mockApiClient {
    return this.client;
  }

  public isUsingMockApi(): boolean {
    return this.config.useMockApi;
  }

  public updateConfig(newConfig: Partial<ApiServiceConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.initializeClient();
  }

  public getConfig(): ApiServiceConfig {
    return { ...this.config };
  }
}

// Create singleton instance
export const apiServiceFactory = new ApiServiceFactory();

// Export the client getter for easy use
export const getApiClient = () => apiServiceFactory.getClient();
export const isMockMode = () => apiServiceFactory.isUsingMockApi();
