// services/user/userService.ts
import { ApiResponse } from '../../types/common';
import { getApiClient } from '../api/apiServiceFactory';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  dateJoined: string;
  lastLogin: string;
  preferences: {
    language: string;
    theme: string;
    notifications: {
      email: boolean;
      push: boolean;
      dailyReminder: boolean;
    };
    learning: {
      dailyGoal: number;
      difficulty: string;
      autoAdvance: boolean;
    };
  };
  statistics: {
    totalStudyTime: number;
    wordsLearned: number;
    currentStreak: number;
    longestStreak: number;
  };
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  preferences?: {
    language?: string;
    theme?: string;
    learning?: {
      dailyGoal?: number;
      difficulty?: string;
      autoAdvance?: boolean;
    };
    notifications?: {
      email?: boolean;
      push?: boolean;
      dailyReminder?: boolean;
    };
  };
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export interface UploadAvatarResponse {
  success: boolean;
  avatarUrl: string;
}

export interface DeleteAccountResponse {
  success: boolean;
  message: string;
}

class UserServiceClass {
  private apiClient = getApiClient();

  async updateProfile(profileData: UpdateProfileRequest): Promise<UserProfile> {
    try {
      const response = await this.apiClient.put<ApiResponse<UserProfile>>(
        '/api/users/profile',
        profileData
      );
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to update profile');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  }

  async changePassword(passwordData: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    try {
      const response = await this.apiClient.post<ApiResponse<ChangePasswordResponse>>(
        '/api/users/change-password',
        passwordData
      );
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to change password');
    } catch (error: any) {
      console.error('Error changing password:', error);
      throw new Error(error.response?.data?.message || 'Failed to change password');
    }
  }

  async deleteAccount(): Promise<DeleteAccountResponse> {
    try {
      const response = await this.apiClient.delete<ApiResponse<DeleteAccountResponse>>(
        '/api/users/account'
      );
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to delete account');
    } catch (error: any) {
      console.error('Error deleting account:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete account');
    }
  }

  async uploadAvatar(file: File): Promise<UploadAvatarResponse> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await this.apiClient.post<ApiResponse<UploadAvatarResponse>>(
        '/api/users/avatar',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to upload avatar');
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      throw new Error(error.response?.data?.message || 'Failed to upload avatar');
    }
  }

  async getProfile(): Promise<UserProfile> {
    try {
      const response = await this.apiClient.get<ApiResponse<UserProfile>>(
        '/api/users/profile'
      );
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to get profile');
    } catch (error: any) {
      console.error('Error getting profile:', error);
      throw new Error(error.response?.data?.message || 'Failed to get profile');
    }
  }
}

export const UserService = new UserServiceClass();
