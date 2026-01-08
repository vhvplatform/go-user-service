/**
 * Role API Service
 * Role and permission management endpoints
 */

import apiClient, { isMockMode } from './apiClient';
import {
  ApiResponse,
  PaginatedResponse,
  Role,
  Permission,
  CreateRoleRequest,
  UpdateRoleRequest,
} from '../types/api.types';
import { mockRoles } from '../mockData/users.mock';

const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

let mockRoleData = [...mockRoles];

const mockPermissions: Permission[] = [
  { id: '1', name: 'user:read', resource: 'user', action: 'read', description: 'Read user data', createdAt: '2024-01-01T00:00:00Z' },
  { id: '2', name: 'user:write', resource: 'user', action: 'write', description: 'Create and update users', createdAt: '2024-01-01T00:00:00Z' },
  { id: '3', name: 'user:delete', resource: 'user', action: 'delete', description: 'Delete users', createdAt: '2024-01-01T00:00:00Z' },
  { id: '4', name: 'role:admin', resource: 'role', action: 'admin', description: 'Full role management', createdAt: '2024-01-01T00:00:00Z' },
  { id: '5', name: 'content:read', resource: 'content', action: 'read', description: 'Read content', createdAt: '2024-01-01T00:00:00Z' },
  { id: '6', name: 'content:admin', resource: 'content', action: 'admin', description: 'Full content management', createdAt: '2024-01-01T00:00:00Z' },
];

class RoleApi {
  /**
   * Get all roles
   */
  async getRoles(page: number = 1, limit: number = 50): Promise<PaginatedResponse<Role>> {
    if (isMockMode()) {
      await mockDelay();
      
      const total = mockRoleData.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const items = mockRoleData.slice(startIndex, endIndex);
      
      return {
        success: true,
        message: 'Roles retrieved successfully',
        data: {
          items,
          page,
          limit,
          total,
          totalPages,
        },
      };
    }
    
    const response = await apiClient.get<PaginatedResponse<Role>>('/roles', {
      params: { page, limit },
    });
    return response.data;
  }

  /**
   * Get role by ID
   */
  async getRoleById(id: string): Promise<ApiResponse<Role>> {
    if (isMockMode()) {
      await mockDelay(300);
      
      const role = mockRoleData.find(r => r.id === id);
      
      if (!role) {
        throw {
          success: false,
          message: 'Role not found',
          error: `Role with ID ${id} does not exist`,
        };
      }
      
      return {
        success: true,
        message: 'Role retrieved successfully',
        data: role,
      };
    }
    
    const response = await apiClient.get<ApiResponse<Role>>(`/roles/${id}`);
    return response.data;
  }

  /**
   * Create new role
   */
  async createRole(data: CreateRoleRequest): Promise<ApiResponse<Role>> {
    if (isMockMode()) {
      await mockDelay();
      
      // Check if role name exists
      const existingRole = mockRoleData.find(r => r.name.toLowerCase() === data.name.toLowerCase());
      if (existingRole) {
        throw {
          success: false,
          message: 'Role creation failed',
          error: 'Role name already exists',
        };
      }
      
      const newRole: Role = {
        id: String(mockRoleData.length + 1),
        name: data.name,
        description: data.description,
        permissions: data.permissions,
        isSystem: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      mockRoleData.push(newRole);
      
      return {
        success: true,
        message: 'Role created successfully',
        data: newRole,
      };
    }
    
    const response = await apiClient.post<ApiResponse<Role>>('/roles', data);
    return response.data;
  }

  /**
   * Update role
   */
  async updateRole(id: string, data: UpdateRoleRequest): Promise<ApiResponse<Role>> {
    if (isMockMode()) {
      await mockDelay();
      
      const roleIndex = mockRoleData.findIndex(r => r.id === id);
      
      if (roleIndex === -1) {
        throw {
          success: false,
          message: 'Role update failed',
          error: 'Role not found',
        };
      }
      
      // Check if it's a system role
      if (mockRoleData[roleIndex].isSystem) {
        throw {
          success: false,
          message: 'Role update failed',
          error: 'Cannot modify system roles',
        };
      }
      
      const updatedRole: Role = {
        ...mockRoleData[roleIndex],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      
      mockRoleData[roleIndex] = updatedRole;
      
      return {
        success: true,
        message: 'Role updated successfully',
        data: updatedRole,
      };
    }
    
    const response = await apiClient.put<ApiResponse<Role>>(`/roles/${id}`, data);
    return response.data;
  }

  /**
   * Delete role
   */
  async deleteRole(id: string): Promise<ApiResponse> {
    if (isMockMode()) {
      await mockDelay();
      
      const roleIndex = mockRoleData.findIndex(r => r.id === id);
      
      if (roleIndex === -1) {
        throw {
          success: false,
          message: 'Role deletion failed',
          error: 'Role not found',
        };
      }
      
      if (mockRoleData[roleIndex].isSystem) {
        throw {
          success: false,
          message: 'Role deletion failed',
          error: 'Cannot delete system roles',
        };
      }
      
      mockRoleData.splice(roleIndex, 1);
      
      return {
        success: true,
        message: 'Role deleted successfully',
      };
    }
    
    const response = await apiClient.delete<ApiResponse>(`/roles/${id}`);
    return response.data;
  }

  /**
   * Get all permissions
   */
  async getPermissions(): Promise<ApiResponse<Permission[]>> {
    if (isMockMode()) {
      await mockDelay();
      
      return {
        success: true,
        message: 'Permissions retrieved successfully',
        data: mockPermissions,
      };
    }
    
    const response = await apiClient.get<ApiResponse<Permission[]>>('/permissions');
    return response.data;
  }

  /**
   * Assign permissions to role
   */
  async assignPermissions(roleId: string, permissionIds: string[]): Promise<ApiResponse> {
    if (isMockMode()) {
      await mockDelay();
      
      const roleIndex = mockRoleData.findIndex(r => r.id === roleId);
      
      if (roleIndex === -1) {
        throw {
          success: false,
          message: 'Permission assignment failed',
          error: 'Role not found',
        };
      }
      
      mockRoleData[roleIndex].permissions = permissionIds;
      mockRoleData[roleIndex].updatedAt = new Date().toISOString();
      
      return {
        success: true,
        message: 'Permissions assigned successfully',
      };
    }
    
    const response = await apiClient.post<ApiResponse>(`/roles/${roleId}/permissions`, {
      permissions: permissionIds,
    });
    return response.data;
  }
}

export default new RoleApi();
