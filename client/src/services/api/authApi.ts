/**
 * Auth API Service
 * Authentication and authorization endpoints
 */

import apiClient, { isMockMode } from './apiClient';
import { 
  ApiResponse, 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ResetPasswordRequest,
  User
} from '../types/api.types';
import { mockUsers, mockRoles } from '../mockData/users.mock';

// Mock delay simulation
const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

class AuthApi {
  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    if (isMockMode()) {
      await mockDelay();
      
      // Mock login logic
      const user = mockUsers.find(u => u.email === credentials.email);
      
      if (!user) {
        throw {
          success: false,
          message: 'Invalid credentials',
          error: 'User not found',
        };
      }
      
      // In real implementation, password would be checked
      // For mock, we accept any password
      
      const mockResponse: LoginResponse = {
        user,
        accessToken: `mock_access_token_${Date.now()}`,
        refreshToken: `mock_refresh_token_${Date.now()}`,
        expiresIn: 3600,
      };
      
      return {
        success: true,
        message: 'Login successful',
        data: mockResponse,
      };
    }
    
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    return response.data;
  }

  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<ApiResponse<LoginResponse>> {
    if (isMockMode()) {
      await mockDelay();
      
      // Check if email already exists
      const existingUser = mockUsers.find(u => u.email === data.email);
      if (existingUser) {
        throw {
          success: false,
          message: 'Registration failed',
          error: 'Email already exists',
        };
      }
      
      // Create new user
      const newUser: User = {
        id: String(mockUsers.length + 1),
        email: data.email,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
        status: 'active',
        roleId: '3', // Default to User role
        role: mockRoles[2],
        loginCount: 0,
        failedAttempts: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      mockUsers.push(newUser);
      
      const mockResponse: LoginResponse = {
        user: newUser,
        accessToken: `mock_access_token_${Date.now()}`,
        refreshToken: `mock_refresh_token_${Date.now()}`,
        expiresIn: 3600,
      };
      
      return {
        success: true,
        message: 'Registration successful',
        data: mockResponse,
      };
    }
    
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/register', data);
    return response.data;
  }

  /**
   * Refresh access token
   */
  async refreshToken(data: RefreshTokenRequest): Promise<ApiResponse<RefreshTokenResponse>> {
    if (isMockMode()) {
      await mockDelay(200);
      
      const mockResponse: RefreshTokenResponse = {
        accessToken: `mock_access_token_${Date.now()}`,
        refreshToken: `mock_refresh_token_${Date.now()}`,
        expiresIn: 3600,
      };
      
      return {
        success: true,
        message: 'Token refreshed successfully',
        data: mockResponse,
      };
    }
    
    const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>('/auth/refresh', data);
    return response.data;
  }

  /**
   * Logout user
   */
  async logout(): Promise<ApiResponse> {
    if (isMockMode()) {
      await mockDelay(200);
      
      return {
        success: true,
        message: 'Logout successful',
      };
    }
    
    const response = await apiClient.post<ApiResponse>('/auth/logout');
    return response.data;
  }

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<ApiResponse> {
    if (isMockMode()) {
      await mockDelay();
      
      const user = mockUsers.find(u => u.email === email);
      if (!user) {
        throw {
          success: false,
          message: 'User not found',
          error: 'Email does not exist',
        };
      }
      
      return {
        success: true,
        message: 'Password reset email sent',
        data: { email, resetToken: `mock_reset_token_${Date.now()}` },
      };
    }
    
    const response = await apiClient.post<ApiResponse>('/auth/forgot-password', { email });
    return response.data;
  }

  /**
   * Reset password
   */
  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse> {
    if (isMockMode()) {
      await mockDelay();
      
      return {
        success: true,
        message: 'Password reset successful',
      };
    }
    
    const response = await apiClient.post<ApiResponse>('/auth/reset-password', data);
    return response.data;
  }

  /**
   * Verify email
   */
  async verifyEmail(token: string): Promise<ApiResponse> {
    if (isMockMode()) {
      await mockDelay();
      
      return {
        success: true,
        message: 'Email verified successfully',
      };
    }
    
    const response = await apiClient.post<ApiResponse>('/auth/verify-email', { token });
    return response.data;
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    if (isMockMode()) {
      await mockDelay(200);
      
      // Return first admin user as current user
      const currentUser = mockUsers[0];
      
      return {
        success: true,
        message: 'User retrieved successfully',
        data: currentUser,
      };
    }
    
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data;
  }

  /**
   * Update current user password
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse> {
    if (isMockMode()) {
      await mockDelay();
      
      // Mock password validation
      if (oldPassword === newPassword) {
        throw {
          success: false,
          message: 'Password change failed',
          error: 'New password must be different from old password',
        };
      }
      
      return {
        success: true,
        message: 'Password changed successfully',
      };
    }
    
    const response = await apiClient.post<ApiResponse>('/auth/change-password', {
      oldPassword,
      newPassword,
    });
    return response.data;
  }
}

export default new AuthApi();
