/**
 * Authentication Service
 * Handles authentication and authorization
 */

import { authServiceClient, ApiResponse, setAuthToken, removeAuthToken } from './api-client';

export interface LoginRequest {
  username: string;
  password: string;
  remember?: boolean;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  expiresIn: number;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Login user
 */
export async function login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
  const response = await authServiceClient.post<LoginResponse>('/api/v1/auth/login', data);
  
  // Save token on successful login
  if (response.success && response.data?.token) {
    setAuthToken(response.data.token);
  }
  
  return response;
}

/**
 * Logout user
 */
export async function logout(): Promise<ApiResponse<void>> {
  const response = await authServiceClient.post('/api/v1/auth/logout');
  
  // Remove token on logout
  removeAuthToken();
  
  return response;
}

/**
 * Register new user
 */
export async function register(data: RegisterRequest): Promise<ApiResponse<LoginResponse>> {
  const response = await authServiceClient.post<LoginResponse>('/api/v1/auth/register', data);
  
  // Save token on successful registration
  if (response.success && response.data?.token) {
    setAuthToken(response.data.token);
  }
  
  return response;
}

/**
 * Refresh authentication token
 */
export async function refreshToken(refreshToken: string): Promise<ApiResponse<LoginResponse>> {
  const response = await authServiceClient.post<LoginResponse>('/api/v1/auth/refresh', {
    refreshToken,
  });
  
  // Update token
  if (response.success && response.data?.token) {
    setAuthToken(response.data.token);
  }
  
  return response;
}

/**
 * Request password reset
 */
export async function requestPasswordReset(data: ResetPasswordRequest): Promise<ApiResponse<void>> {
  return await authServiceClient.post('/api/v1/auth/forgot-password', data);
}

/**
 * Reset password with token
 */
export async function resetPassword(token: string, newPassword: string): Promise<ApiResponse<void>> {
  return await authServiceClient.post('/api/v1/auth/reset-password', {
    token,
    newPassword,
  });
}

/**
 * Change password
 */
export async function changePassword(data: ChangePasswordRequest): Promise<ApiResponse<void>> {
  return await authServiceClient.post('/api/v1/auth/change-password', data);
}

/**
 * Verify email
 */
export async function verifyEmail(token: string): Promise<ApiResponse<void>> {
  return await authServiceClient.post('/api/v1/auth/verify-email', { token });
}

/**
 * Resend verification email
 */
export async function resendVerificationEmail(email: string): Promise<ApiResponse<void>> {
  return await authServiceClient.post('/api/v1/auth/resend-verification', { email });
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  try {
    const token = localStorage.getItem('auth_token');
    return !!token;
  } catch {
    return false;
  }
}
