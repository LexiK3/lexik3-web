// services/progress/progressService.ts
import { getApiClient } from '../api/apiServiceFactory';
import { API_ENDPOINTS } from '../api/endpoints';
import { 
  ProgressOverview, 
  DailyProgress, 
  Statistics, 
  Achievement,
  ProgressData,
  StreakData
} from '../../types/progress';
import { ApiResponse } from '../../types/common';
import { AxiosResponse } from 'axios';

export class ProgressService {
  // Get overall progress overview
  static async getProgressOverview(): Promise<ProgressOverview> {
    try {
      const client = getApiClient();
      const response = await (client as any).get(API_ENDPOINTS.PROGRESS.OVERALL) as AxiosResponse<ApiResponse<ProgressOverview>>;
      return response.data.data;
    } catch (error: any) {
      throw new Error(this.handleProgressError(error));
    }
  }

  // Get daily progress data
  static async getDailyProgress(days?: number): Promise<DailyProgress[]> {
    try {
      const client = getApiClient();
      const params = days ? `?days=${days}` : '';
      const response = await (client as any).get(`${API_ENDPOINTS.PROGRESS.DAILY}${params}`) as AxiosResponse<ApiResponse<DailyProgress[]>>;
      return response.data.data;
    } catch (error: any) {
      throw new Error(this.handleProgressError(error));
    }
  }

  // Get detailed statistics
  static async getStatistics(): Promise<Statistics> {
    try {
      const client = getApiClient();
      const response = await (client as any).get(API_ENDPOINTS.PROGRESS.STATISTICS) as AxiosResponse<ApiResponse<Statistics>>;
      return response.data.data;
    } catch (error: any) {
      throw new Error(this.handleProgressError(error));
    }
  }

  // Get user achievements
  static async getAchievements(): Promise<Achievement[]> {
    try {
      const client = getApiClient();
      const response = await (client as any).get(API_ENDPOINTS.PROGRESS.ACHIEVEMENTS) as AxiosResponse<ApiResponse<Achievement[]>>;
      return response.data.data;
    } catch (error: any) {
      throw new Error(this.handleProgressError(error));
    }
  }

  // Get progress data for a specific book
  static async getBookProgress(bookId: string): Promise<ProgressData> {
    try {
      const client = getApiClient();
      const response = await (client as any).get(`${API_ENDPOINTS.PROGRESS.OVERALL}/book/${bookId}`) as AxiosResponse<ApiResponse<ProgressData>>;
      return response.data.data;
    } catch (error: any) {
      throw new Error(this.handleProgressError(error));
    }
  }

  // Get streak data
  static async getStreakData(): Promise<StreakData> {
    try {
      const client = getApiClient();
      const response = await (client as any).get(`${API_ENDPOINTS.PROGRESS.OVERALL}/streak`) as AxiosResponse<ApiResponse<StreakData>>;
      return response.data.data;
    } catch (error: any) {
      throw new Error(this.handleProgressError(error));
    }
  }

  // Get progress data for a specific date range
  static async getProgressByDateRange(startDate: string, endDate: string): Promise<DailyProgress[]> {
    try {
      const client = getApiClient();
      const response = await (client as any).get(`${API_ENDPOINTS.PROGRESS.DAILY}?start=${startDate}&end=${endDate}`) as AxiosResponse<ApiResponse<DailyProgress[]>>;
      return response.data.data;
    } catch (error: any) {
      throw new Error(this.handleProgressError(error));
    }
  }

  // Get learning goals and targets
  static async getLearningGoals(): Promise<any> {
    try {
      const client = getApiClient();
      const response = await (client as any).get(`${API_ENDPOINTS.PROGRESS.OVERALL}/goals`) as AxiosResponse<ApiResponse<any>>;
      return response.data.data;
    } catch (error: any) {
      throw new Error(this.handleProgressError(error));
    }
  }

  // Update learning goals
  static async updateLearningGoals(goals: any): Promise<void> {
    try {
      const client = getApiClient();
      await (client as any).put(`${API_ENDPOINTS.PROGRESS.OVERALL}/goals`, goals);
    } catch (error: any) {
      throw new Error(this.handleProgressError(error));
    }
  }

  // Handle progress service errors
  private static handleProgressError(error: any): string {
    if (error.response?.data?.error) {
      const { code, message } = error.response.data.error;
      
      switch (code) {
        case 'PROGRESS_NOT_FOUND':
          return 'Progress data not found.';
        case 'INVALID_DATE_RANGE':
          return 'Invalid date range provided.';
        case 'BOOK_NOT_FOUND':
          return 'Book not found.';
        case 'VALIDATION_ERROR':
          return 'Please check your input and try again.';
        case 'RATE_LIMITED':
          return 'Too many requests. Please wait a moment.';
        default:
          return message || 'An error occurred while fetching progress data.';
      }
    }
    
    return 'Network error. Please check your connection.';
  }
}
