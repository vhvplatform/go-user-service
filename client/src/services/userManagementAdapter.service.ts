/**
 * User Management Adapter
 * Adapter để kết nối userApi với AdvancedUserManagement component
 */

import userApi from './api/userApi';
import { isMockMode } from './api/apiClient';
import type { User as ApiUser } from './types/api.types';

export interface UserManagement {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'user' | 'guest';
  status: 'active' | 'inactive' | 'suspended';
  department?: string;
  location?: string;
  joinDate: string;
  lastLogin?: string;
  lastActive?: string;
  tags: string[];
}

export interface CreateUserData {
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserManagement['role'];
  status?: UserManagement['status'];
  department?: string;
  location?: string;
}

export interface UpdateUserData {
  fullName?: string;
  email?: string;
  phone?: string;
  role?: UserManagement['role'];
  status?: UserManagement['status'];
  department?: string;
  location?: string;
}

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserListResponse {
  data: UserManagement[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Map từ API role sang component role
const mapRoleToComponent = (roleId?: string, roleName?: string): UserManagement['role'] => {
  if (!roleId && !roleName) return 'user';
  
  const name = roleName?.toLowerCase() || '';
  if (name.includes('admin')) return 'admin';
  if (name.includes('manager')) return 'manager';
  if (name.includes('guest')) return 'guest';
  return 'user';
};

// Map từ component role sang API roleId
const mapComponentRoleToApi = (role: UserManagement['role']): string => {
  const roleMap: Record<UserManagement['role'], string> = {
    admin: '1',
    manager: '2',
    user: '3',
    guest: '4',
  };
  return roleMap[role] || '3';
};

// Convert API User to UserManagement
const convertToUserManagement = (apiUser: ApiUser): UserManagement => {
  return {
    id: apiUser.id,
    username: apiUser.username,
    email: apiUser.email,
    fullName: `${apiUser.firstName} ${apiUser.lastName}`.trim(),
    phone: apiUser.phoneNumber,
    avatar: apiUser.avatar,
    role: mapRoleToComponent(apiUser.roleId, apiUser.role?.name),
    status: apiUser.status as UserManagement['status'],
    department: apiUser.role?.name || undefined,
    location: undefined, // API không có field này
    joinDate: apiUser.createdAt.split('T')[0],
    lastLogin: apiUser.lastLoginAt ? formatRelativeTime(apiUser.lastLoginAt) : undefined,
    lastActive: apiUser.lastLoginAt,
    tags: [], // API không có field này
  };
};

// Format relative time
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Vừa xong';
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
  return date.toLocaleDateString('vi-VN');
};

class UserManagementAdapterService {
  /**
   * Get list of users
   */
  async getUsers(params?: UserListParams): Promise<UserListResponse> {
    try {
      const apiParams = {
        page: params?.page || 1,
        limit: params?.limit || 10,
        search: params?.search,
        status: params?.status && params.status !== 'all' ? params.status : undefined,
        roleId: params?.role && params?.role !== 'all' ? mapComponentRoleToApi(params.role as any) : undefined,
        sortBy: params?.sortBy || 'createdAt',
        sortOrder: params?.sortOrder || 'desc',
      };

      const response = await userApi.getUsers(apiParams);

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch users');
      }

      return {
        data: response.data.items.map(convertToUserManagement),
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit,
        totalPages: response.data.totalPages,
      };
    } catch (error: any) {
      console.error('Error fetching users:', error);
      
      // Return empty data instead of throwing error
      // This prevents the app from crashing when backend is unavailable
      return {
        data: [],
        total: 0,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: 0,
      };
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<UserManagement> {
    try {
      const response = await userApi.getUserById(id);

      if (!response.success || !response.data) {
        throw new Error(response.message || 'User not found');
      }

      return convertToUserManagement(response.data);
    } catch (error: any) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  /**
   * Create new user
   */
  async createUser(data: CreateUserData): Promise<UserManagement> {
    try {
      const [firstName, ...lastNameParts] = data.fullName.split(' ');
      const lastName = lastNameParts.join(' ');

      const response = await userApi.createUser({
        username: data.username,
        email: data.email,
        firstName: firstName || data.fullName,
        lastName: lastName || '',
        phoneNumber: data.phone,
        roleId: mapComponentRoleToApi(data.role),
        password: 'TempPassword123!', // In production, this should be handled differently
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to create user');
      }

      return convertToUserManagement(response.data);
    } catch (error: any) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update user
   */
  async updateUser(id: string, data: UpdateUserData): Promise<UserManagement> {
    try {
      let firstName: string | undefined;
      let lastName: string | undefined;

      if (data.fullName) {
        const [first, ...lastParts] = data.fullName.split(' ');
        firstName = first;
        lastName = lastParts.join(' ');
      }

      const response = await userApi.updateUser(id, {
        firstName,
        lastName,
        email: data.email,
        phoneNumber: data.phone,
        status: data.status,
        roleId: data.role ? mapComponentRoleToApi(data.role) : undefined,
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to update user');
      }

      return convertToUserManagement(response.data);
    } catch (error: any) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<void> {
    try {
      const response = await userApi.deleteUser(id);

      if (!response.success) {
        throw new Error(response.message || 'Failed to delete user');
      }
    } catch (error: any) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  /**
   * Bulk delete users
   */
  async bulkDeleteUsers(ids: string[]): Promise<void> {
    try {
      const response = await userApi.bulkDeleteUsers(ids);

      if (!response.success) {
        throw new Error(response.message || 'Failed to delete users');
      }
    } catch (error: any) {
      console.error('Error bulk deleting users:', error);
      throw error;
    }
  }

  /**
   * Export users to CSV
   */
  async exportUsers(params?: UserListParams): Promise<void> {
    try {
      const apiParams = {
        search: params?.search,
        status: params?.status && params.status !== 'all' ? params.status : undefined,
        roleId: params?.role && params?.role !== 'all' ? mapComponentRoleToApi(params.role as any) : undefined,
      };

      const blob = await userApi.exportUsers(apiParams);

      // Download file
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `users_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Error exporting users:', error);
      throw error;
    }
  }

  /**
   * Import users from CSV
   */
  async importUsers(file: File): Promise<{ success: number; failed: number; errors: any[] }> {
    try {
      // Read CSV file
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('File CSV trống hoặc không hợp lệ');
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const requiredHeaders = ['username', 'email', 'fullName', 'role'];
      
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      if (missingHeaders.length > 0) {
        throw new Error(`Thiếu các cột bắt buộc: ${missingHeaders.join(', ')}`);
      }

      let success = 0;
      let failed = 0;
      const errors: any[] = [];

      // Process each row
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        try {
          const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
          const rowData: any = {};
          
          headers.forEach((header, index) => {
            rowData[header] = values[index] || '';
          });

          // Validate and create user
          const userData: CreateUserData = {
            username: rowData.username,
            email: rowData.email,
            fullName: rowData.fullName,
            phone: rowData.phone,
            role: (rowData.role || 'user') as any,
            status: (rowData.status || 'active') as any,
            department: rowData.department,
            location: rowData.location,
          };

          await this.createUser(userData);
          success++;
        } catch (error: any) {
          failed++;
          errors.push({
            row: i + 1,
            error: error.message || 'Unknown error',
          });
        }
      }

      return { success, failed, errors };
    } catch (error: any) {
      console.error('Error importing users:', error);
      throw error;
    }
  }

  /**
   * Download import template
   */
  downloadImportTemplate(): void {
    const template = `username,email,fullName,phone,role,status,department,location
johndoe,john@example.com,John Doe,0901234567,user,active,IT,Hà Nội
janedoe,jane@example.com,Jane Doe,0907654321,manager,active,Sales,TP.HCM
admin,admin@example.com,Admin User,0909123456,admin,active,IT,Hà Nội`;

    const BOM = '\uFEFF'; // UTF-8 BOM for Excel
    const blob = new Blob([BOM + template], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'users_import_template.csv');
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    suspended: number;
  }> {
    try {
      const response = await userApi.getUserStats();

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch stats');
      }

      return {
        total: response.data.total,
        active: response.data.active,
        inactive: response.data.inactive,
        suspended: response.data.suspended || 0,
      };
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }
}

export const userManagementAdapter = new UserManagementAdapterService();