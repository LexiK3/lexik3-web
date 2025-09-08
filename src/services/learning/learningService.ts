// services/learning/learningService.ts
import { getApiClient } from '../api/apiServiceFactory';
import { API_ENDPOINTS } from '../api/endpoints';
import { 
  LearningSession, 
  LearningSessionRequest, 
  AnswerSubmission, 
  AnswerResponse,
  SessionHistory,
  SessionStatistics
} from '../../types/learning';
import { ApiResponse } from '../../types/common';
import { AxiosResponse } from 'axios';

export class LearningService {
  // Start a new learning session
  static async startSession(sessionRequest: LearningSessionRequest): Promise<LearningSession> {
    try {
      const client = getApiClient();
      const response = await (client as any).post(API_ENDPOINTS.LEARNING.START_SESSION, sessionRequest) as AxiosResponse<ApiResponse<LearningSession>>;
      return response.data.data;
    } catch (error: any) {
      throw new Error(this.handleLearningError(error));
    }
  }

  // Submit an answer for a word in the session
  static async submitAnswer(sessionId: string, answer: AnswerSubmission): Promise<AnswerResponse> {
    try {
      const client = getApiClient();
      const response = await (client as any).post(API_ENDPOINTS.LEARNING.SUBMIT_ANSWER(sessionId), answer) as AxiosResponse<ApiResponse<AnswerResponse>>;
      return response.data.data;
    } catch (error: any) {
      throw new Error(this.handleLearningError(error));
    }
  }

  // Complete a learning session
  static async completeSession(sessionId: string): Promise<SessionStatistics> {
    try {
      const client = getApiClient();
      const response = await (client as any).post(API_ENDPOINTS.LEARNING.COMPLETE_SESSION(sessionId)) as AxiosResponse<ApiResponse<SessionStatistics>>;
      return response.data.data;
    } catch (error: any) {
      throw new Error(this.handleLearningError(error));
    }
  }

  // Get session history
  static async getSessionHistory(limit?: number, offset?: number): Promise<SessionHistory[]> {
    try {
      const client = getApiClient();
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());
      if (offset) params.append('offset', offset.toString());
      
      const response = await (client as any).get(`${API_ENDPOINTS.LEARNING.SESSION_HISTORY}?${params.toString()}`) as AxiosResponse<ApiResponse<SessionHistory[]>>;
      return response.data.data;
    } catch (error: any) {
      throw new Error(this.handleLearningError(error));
    }
  }

  // Get current active session
  static async getCurrentSession(): Promise<LearningSession | null> {
    try {
      const client = getApiClient();
      const response = await (client as any).get(`${API_ENDPOINTS.LEARNING.START_SESSION}/current`) as AxiosResponse<ApiResponse<LearningSession | null>>;
      return response.data.data;
    } catch (error: any) {
      // If no active session, return null instead of throwing
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error(this.handleLearningError(error));
    }
  }

  // Pause a learning session
  static async pauseSession(sessionId: string): Promise<void> {
    try {
      const client = getApiClient();
      await (client as any).post(`${API_ENDPOINTS.LEARNING.START_SESSION}/${sessionId}/pause`);
    } catch (error: any) {
      throw new Error(this.handleLearningError(error));
    }
  }

  // Resume a paused learning session
  static async resumeSession(sessionId: string): Promise<LearningSession> {
    try {
      const client = getApiClient();
      const response = await (client as any).post(`${API_ENDPOINTS.LEARNING.START_SESSION}/${sessionId}/resume`) as AxiosResponse<ApiResponse<LearningSession>>;
      return response.data.data;
    } catch (error: any) {
      throw new Error(this.handleLearningError(error));
    }
  }

  // Handle learning service errors
  private static handleLearningError(error: any): string {
    if (error.response?.data?.error) {
      const { code, message } = error.response.data.error;
      
      switch (code) {
        case 'SESSION_NOT_FOUND':
          return 'Learning session not found.';
        case 'SESSION_ALREADY_COMPLETED':
          return 'This session has already been completed.';
        case 'SESSION_EXPIRED':
          return 'This session has expired. Please start a new one.';
        case 'INVALID_ANSWER':
          return 'Invalid answer format. Please try again.';
        case 'NO_ACTIVE_SESSION':
          return 'No active learning session found.';
        case 'BOOK_NOT_ENROLLED':
          return 'You are not enrolled in this book.';
        case 'DAILY_LIMIT_REACHED':
          return 'You have reached your daily learning limit.';
        case 'VALIDATION_ERROR':
          return 'Please check your input and try again.';
        case 'RATE_LIMITED':
          return 'Too many requests. Please wait a moment.';
        default:
          return message || 'An error occurred during learning.';
      }
    }
    
    return 'Network error. Please check your connection.';
  }
}
