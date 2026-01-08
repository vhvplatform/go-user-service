/**
 * User Management Service
 * Tích hợp với go-user-service API và mock data
 */

import { api } from './apiClient';

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
  status: UserManagement['status'];
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
  pageSize?: number;
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
  pageSize: number;
  totalPages: number;
}

export interface BulkActionRequest {
  userIds: string[];
  action: 'activate' | 'deactivate' | 'suspend' | 'delete';
}

export interface ImportUsersRequest {
  file: File;
  skipDuplicates?: boolean;
}

export interface ImportUsersResponse {
  success: number;
  failed: number;
  errors: Array<{ row: number; error: string }>;
}

class UserManagementService {
  private baseUrl = '/api/v1/users';

  /**
   * Get list of users with pagination and filters
   */
  async getUsers(params?: UserListParams): Promise<UserListResponse> {
    try {
      const response = await api.get<UserListResponse>(this.baseUrl, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<UserManagement> {
    try {
      const response = await api.get<UserManagement>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  /**
   * Create new user
   */
  async createUser(data: CreateUserData): Promise<UserManagement> {
    try {
      const response = await api.post<UserManagement>(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update user
   */
  async updateUser(id: string, data: UpdateUserData): Promise<UserManagement> {
    try {
      const response = await api.put<UserManagement>(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  /**
   * Update user status
   */
  async updateUserStatus(
    id: string,
    status: UserManagement['status']
  ): Promise<UserManagement> {
    try {
      const response = await api.patch<UserManagement>(`${this.baseUrl}/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  /**
   * Bulk actions on users
   */
  async bulkAction(request: BulkActionRequest): Promise<{ success: number; failed: number }> {
    try {
      const response = await api.post<{ success: number; failed: number }>(
        `${this.baseUrl}/bulk-action`,
        request
      );
      return response.data;
    } catch (error) {
      console.error('Error performing bulk action:', error);
      throw error;
    }
  }

  /**
   * Export users to CSV
   */
  async exportUsers(params?: UserListParams): Promise<Blob> {
    try {
      const response = await api.get(`${this.baseUrl}/export`, {
        params,
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting users:', error);
      throw error;
    }
  }

  /**
   * Import users from CSV
   */
  async importUsers(request: ImportUsersRequest): Promise<ImportUsersResponse> {
    try {
      const formData = new FormData();
      formData.append('file', request.file);
      if (request.skipDuplicates !== undefined) {
        formData.append('skipDuplicates', String(request.skipDuplicates));
      }

      const response = await api.post<ImportUsersResponse>(
        `${this.baseUrl}/import`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error importing users:', error);
      throw error;
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    suspended: number;
    byRole: Record<string, number>;
    byDepartment: Record<string, number>;
  }> {
    try {
      const response = await api.get<any>(`${this.baseUrl}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }

  /**
   * Download CSV template for import
   */
  downloadImportTemplate(): void {
    const template = `username,email,fullName,phone,role,status,department,location
johndoe,john@example.com,John Doe,0901234567,user,active,IT,Hà Nội
janedoe,jane@example.com,Jane Doe,0907654321,manager,active,Sales,TP.HCM`;
    
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'users_import_template.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Export users to CSV file (client-side)
   */
  exportUsersToCSV(users: UserManagement[], filename: string = 'users.csv'): void {
    const headers = ['ID', 'Username', 'Email', 'Full Name', 'Phone', 'Role', 'Status', 'Department', 'Location', 'Join Date', 'Last Login'];
    
    const rows = users.map(user => [
      user.id,
      user.username,
      user.email,
      user.fullName,
      user.phone || '',
      user.role,
      user.status,
      user.department || '',
      user.location || '',
      user.joinDate,
      user.lastLogin || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const BOM = '\uFEFF'; // UTF-8 BOM for Excel compatibility
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const userManagementService = new UserManagementService();
