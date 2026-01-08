/**
 * User API Service
 * User management endpoints
 */

import apiClient, { isMockMode } from './apiClient';
import {
  ApiResponse,
  PaginatedResponse,
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserListParams,
} from '../types/api.types';
import { mockUsers, generateMockUsers, mockRoles } from '../mockData/users.mock';

// Mock delay simulation
const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Local storage for mock data persistence
let mockUserData = [...mockUsers];

class UserApi {
  /**
   * Get all users with pagination
   */
  async getUsers(params?: UserListParams): Promise<PaginatedResponse<User>> {
    if (isMockMode()) {
      await mockDelay();
      
      const { page = 1, limit = 10, status, roleId, search, sortBy = 'createdAt', sortOrder = 'desc' } = params || {};
      
      // Filter users
      let filteredUsers = [...mockUserData];
      
      if (status) {
        filteredUsers = filteredUsers.filter(u => u.status === status);
      }
      
      if (roleId) {
        filteredUsers = filteredUsers.filter(u => u.roleId === roleId);
      }
      
      if (search) {
        const searchLower = search.toLowerCase();
        filteredUsers = filteredUsers.filter(
          u =>
            u.email.toLowerCase().includes(searchLower) ||
            u.username.toLowerCase().includes(searchLower) ||
            u.firstName.toLowerCase().includes(searchLower) ||
            u.lastName.toLowerCase().includes(searchLower)
        );
      }
      
      // Sort users
      filteredUsers.sort((a, b) => {
        let aVal: any = a[sortBy as keyof User];
        let bVal: any = b[sortBy as keyof User];
        
        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }
        
        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
      
      // Paginate
      const total = filteredUsers.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
      
      return {
        success: true,
        message: 'Users retrieved successfully',
        data: {
          items: paginatedUsers,
          page,
          limit,
          total,
          totalPages,
        },
      };
    }
    
    const response = await apiClient.get<PaginatedResponse<User>>('/users', { params });
    return response.data;
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<ApiResponse<User>> {
    if (isMockMode()) {
      await mockDelay(300);
      
      const user = mockUserData.find(u => u.id === id);
      
      if (!user) {
        throw {
          success: false,
          message: 'User not found',
          error: `User with ID ${id} does not exist`,
        };
      }
      
      return {
        success: true,
        message: 'User retrieved successfully',
        data: user,
      };
    }
    
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  }

  /**
   * Create new user
   */
  async createUser(data: CreateUserRequest): Promise<ApiResponse<User>> {
    if (isMockMode()) {
      await mockDelay();
      
      // Validate email uniqueness
      const existingUser = mockUserData.find(u => u.email === data.email);
      if (existingUser) {
        throw {
          success: false,
          message: 'User creation failed',
          error: 'Email already exists',
        };
      }
      
      // Validate username uniqueness
      const existingUsername = mockUserData.find(u => u.username === data.username);
      if (existingUsername) {
        throw {
          success: false,
          message: 'User creation failed',
          error: 'Username already exists',
        };
      }
      
      // Find role
      const role = mockRoles.find(r => r.id === data.roleId);
      
      // Create new user
      const newUser: User = {
        id: String(mockUserData.length + 1),
        email: data.email,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
        status: 'active',
        roleId: data.roleId,
        role,
        loginCount: 0,
        failedAttempts: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      mockUserData.push(newUser);
      
      return {
        success: true,
        message: 'User created successfully',
        data: newUser,
      };
    }
    
    const response = await apiClient.post<ApiResponse<User>>('/users', data);
    return response.data;
  }

  /**
   * Update user
   */
  async updateUser(id: string, data: UpdateUserRequest): Promise<ApiResponse<User>> {
    if (isMockMode()) {
      await mockDelay();
      
      const userIndex = mockUserData.findIndex(u => u.id === id);
      
      if (userIndex === -1) {
        throw {
          success: false,
          message: 'User update failed',
          error: 'User not found',
        };
      }
      
      // Update user
      const updatedUser: User = {
        ...mockUserData[userIndex],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      
      mockUserData[userIndex] = updatedUser;
      
      return {
        success: true,
        message: 'User updated successfully',
        data: updatedUser,
      };
    }
    
    const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, data);
    return response.data;
  }

  /**
   * Delete user (soft delete)
   */
  async deleteUser(id: string): Promise<ApiResponse> {
    if (isMockMode()) {
      await mockDelay();
      
      const userIndex = mockUserData.findIndex(u => u.id === id);
      
      if (userIndex === -1) {
        throw {
          success: false,
          message: 'User deletion failed',
          error: 'User not found',
        };
      }
      
      // Soft delete
      mockUserData[userIndex] = {
        ...mockUserData[userIndex],
        deletedAt: new Date().toISOString(),
        status: 'inactive',
      };
      
      return {
        success: true,
        message: 'User deleted successfully',
      };
    }
    
    const response = await apiClient.delete<ApiResponse>(`/users/${id}`);
    return response.data;
  }

  /**
   * Restore deleted user
   */
  async restoreUser(id: string): Promise<ApiResponse<User>> {
    if (isMockMode()) {
      await mockDelay();
      
      const userIndex = mockUserData.findIndex(u => u.id === id);
      
      if (userIndex === -1) {
        throw {
          success: false,
          message: 'User restoration failed',
          error: 'User not found',
        };
      }
      
      // Restore user
      const restoredUser: User = {
        ...mockUserData[userIndex],
        deletedAt: undefined,
        status: 'active',
        updatedAt: new Date().toISOString(),
      };
      
      mockUserData[userIndex] = restoredUser;
      
      return {
        success: true,
        message: 'User restored successfully',
        data: restoredUser,
      };
    }
    
    const response = await apiClient.post<ApiResponse<User>>(`/users/${id}/restore`);
    return response.data;
  }

  /**
   * Bulk delete users
   */
  async bulkDeleteUsers(ids: string[]): Promise<ApiResponse> {
    if (isMockMode()) {
      await mockDelay();
      
      const now = new Date().toISOString();
      
      ids.forEach(id => {
        const userIndex = mockUserData.findIndex(u => u.id === id);
        if (userIndex !== -1) {
          mockUserData[userIndex] = {
            ...mockUserData[userIndex],
            deletedAt: now,
            status: 'inactive',
          };
        }
      });
      
      return {
        success: true,
        message: `${ids.length} users deleted successfully`,
      };
    }
    
    const response = await apiClient.post<ApiResponse>('/users/bulk-delete', { ids });
    return response.data;
  }

  /**
   * Export users to Excel
   */
  async exportUsers(params?: UserListParams): Promise<Blob> {
    if (isMockMode()) {
      await mockDelay();
      
      // Mock CSV export
      const headers = ['ID', 'Email', 'Username', 'First Name', 'Last Name', 'Status', 'Role', 'Created At'];
      const rows = mockUserData.map(u => [
        u.id,
        u.email,
        u.username,
        u.firstName,
        u.lastName,
        u.status,
        u.role?.name || '',
        u.createdAt,
      ]);
      
      const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
      
      return new Blob([csv], { type: 'text/csv' });
    }
    
    const response = await apiClient.get('/users/export', {
      params,
      responseType: 'blob',
    });
    
    return response.data;
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<ApiResponse<any>> {
    if (isMockMode()) {
      await mockDelay();
      
      const activeUsers = mockUserData.filter(u => u.status === 'active').length;
      const inactiveUsers = mockUserData.filter(u => u.status === 'inactive').length;
      const suspendedUsers = mockUserData.filter(u => u.status === 'suspended').length;
      
      const stats = {
        total: mockUserData.length,
        active: activeUsers,
        inactive: inactiveUsers,
        suspended: suspendedUsers,
        byRole: mockRoles.map(role => ({
          roleId: role.id,
          roleName: role.name,
          count: mockUserData.filter(u => u.roleId === role.id).length,
        })),
      };
      
      return {
        success: true,
        message: 'User statistics retrieved successfully',
        data: stats,
      };
    }
    
    const response = await apiClient.get<ApiResponse<any>>('/users/stats');
    return response.data;
  }
}

export default new UserApi();
