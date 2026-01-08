/**
 * User Service
 * Handles user-related API calls to go-user-service
 * Repository: https://github.com/vhvplatform/go-user-service
 */

import { userServiceClient, ApiResponse } from './api-client';

export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'manager' | 'user' | 'guest';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  status?: string;
}

export interface UserListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Get list of users
 */
export async function getUsers(params?: UserListParams): Promise<ApiResponse<User[]>> {
  return await userServiceClient.get('/api/v1/users', { params });
}

/**
 * Get user by ID
 */
export async function getUserById(id: string): Promise<ApiResponse<User>> {
  return await userServiceClient.get(`/api/v1/users/${id}`);
}

/**
 * Create new user
 */
export async function createUser(data: CreateUserRequest): Promise<ApiResponse<User>> {
  return await userServiceClient.post('/api/v1/users', data);
}

/**
 * Update user
 */
export async function updateUser(id: string, data: UpdateUserRequest): Promise<ApiResponse<User>> {
  return await userServiceClient.put(`/api/v1/users/${id}`, data);
}

/**
 * Delete user
 */
export async function deleteUser(id: string): Promise<ApiResponse<void>> {
  return await userServiceClient.delete(`/api/v1/users/${id}`);
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<ApiResponse<User>> {
  return await userServiceClient.get('/api/v1/users/me');
}

/**
 * Update user status
 */
export async function updateUserStatus(
  id: string,
  status: 'active' | 'inactive' | 'suspended'
): Promise<ApiResponse<User>> {
  return await userServiceClient.patch(`/api/v1/users/${id}/status`, { status });
}

/**
 * Bulk delete users
 */
export async function bulkDeleteUsers(ids: string[]): Promise<ApiResponse<void>> {
  return await userServiceClient.post('/api/v1/users/bulk-delete', { ids });
}

/**
 * Export users to CSV
 */
export async function exportUsers(params?: UserListParams): Promise<ApiResponse<Blob>> {
  return await userServiceClient.get('/api/v1/users/export', {
    params,
    responseType: 'blob',
  });
}
