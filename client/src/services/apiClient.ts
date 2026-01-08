/**
 * API Client
 * Unified API client that handles both mock and real API calls
 */

import { apiConfig, getApiUrl, isUsingMockData } from '@/config/apiConfig';
import authApi from './api/authApi';
import userApi from './api/userApi';
import roleApi from './api/roleApi';
import analyticsApi from './api/analyticsApi';
import notificationApi from './api/notificationApi';
import reportApi from './api/reportApi';

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// API Client class
class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = apiConfig.apiBaseUrls[apiConfig.environment];
    this.timeout = apiConfig.timeout;
  }

  /**
   * Make HTTP request
   */
  private async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-ID': 'tenant_001', // TODO: Get from auth context
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw {
          message: data.message || 'Request failed',
          status: response.status,
          code: data.code,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw {
          message: 'Request timeout',
          code: 'TIMEOUT',
        };
      }

      throw {
        message: error.message || 'Network error',
        status: error.status,
        code: error.code,
      };
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.request<T>(url, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.request<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.request<T>(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.request<T>(url, { method: 'DELETE' });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.request<T>(url, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// Create API client instance
const apiClient = new ApiClient();

/**
 * Unified API interface that switches between mock and real API
 */
export const api = {
  // Auth endpoints
  auth: {
    login: async (credentials: { username: string; password: string }) => {
      if (isUsingMockData()) {
        return authApi.login(credentials);
      }
      return apiClient.post(getApiUrl('auth', '/login'), credentials);
    },

    logout: async () => {
      if (isUsingMockData()) {
        return authApi.logout();
      }
      return apiClient.post(getApiUrl('auth', '/logout'));
    },

    register: async (userData: any) => {
      if (isUsingMockData()) {
        return authApi.register(userData);
      }
      return apiClient.post(getApiUrl('auth', '/register'), userData);
    },

    getCurrentUser: async () => {
      if (isUsingMockData()) {
        return authApi.getCurrentUser();
      }
      return apiClient.get(getApiUrl('auth', '/me'));
    },

    refreshToken: async () => {
      if (isUsingMockData()) {
        return authApi.refreshToken();
      }
      return apiClient.post(getApiUrl('auth', '/refresh'));
    },
  },

  // User endpoints
  user: {
    getAll: async (params?: any) => {
      if (isUsingMockData()) {
        return userApi.getAll(params);
      }
      const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
      return apiClient.get(getApiUrl('user', queryString));
    },

    getById: async (id: string) => {
      if (isUsingMockData()) {
        return userApi.getById(id);
      }
      return apiClient.get(getApiUrl('user', `/${id}`));
    },

    create: async (userData: any) => {
      if (isUsingMockData()) {
        return userApi.create(userData);
      }
      return apiClient.post(getApiUrl('user'), userData);
    },

    update: async (id: string, userData: any) => {
      if (isUsingMockData()) {
        return userApi.update(id, userData);
      }
      return apiClient.put(getApiUrl('user', `/${id}`), userData);
    },

    delete: async (id: string) => {
      if (isUsingMockData()) {
        return userApi.delete(id);
      }
      return apiClient.delete(getApiUrl('user', `/${id}`));
    },

    bulkUpdate: async (ids: string[], data: any) => {
      if (isUsingMockData()) {
        return userApi.bulkUpdate(ids, data);
      }
      return apiClient.post(getApiUrl('user', '/bulk-update'), { ids, data });
    },

    search: async (query: string) => {
      if (isUsingMockData()) {
        return userApi.search(query);
      }
      return apiClient.get(getApiUrl('user', `/search?q=${encodeURIComponent(query)}`));
    },
  },

  // Role endpoints
  role: {
    getAll: async () => {
      if (isUsingMockData()) {
        return roleApi.getAll();
      }
      return apiClient.get(getApiUrl('role'));
    },

    getById: async (id: string) => {
      if (isUsingMockData()) {
        return roleApi.getById(id);
      }
      return apiClient.get(getApiUrl('role', `/${id}`));
    },

    create: async (roleData: any) => {
      if (isUsingMockData()) {
        return roleApi.create(roleData);
      }
      return apiClient.post(getApiUrl('role'), roleData);
    },

    update: async (id: string, roleData: any) => {
      if (isUsingMockData()) {
        return roleApi.update(id, roleData);
      }
      return apiClient.put(getApiUrl('role', `/${id}`), roleData);
    },

    delete: async (id: string) => {
      if (isUsingMockData()) {
        return roleApi.delete(id);
      }
      return apiClient.delete(getApiUrl('role', `/${id}`));
    },
  },

  // Analytics endpoints
  analytics: {
    getOverview: async () => {
      if (isUsingMockData()) {
        return analyticsApi.getOverview();
      }
      return apiClient.get(getApiUrl('analytics', '/overview'));
    },

    getUserStats: async () => {
      if (isUsingMockData()) {
        return analyticsApi.getUserStats();
      }
      return apiClient.get(getApiUrl('analytics', '/users'));
    },

    getActivityStats: async (period?: string) => {
      if (isUsingMockData()) {
        return analyticsApi.getActivityStats(period);
      }
      const query = period ? `?period=${period}` : '';
      return apiClient.get(getApiUrl('analytics', `/activity${query}`));
    },

    getPerformanceMetrics: async () => {
      if (isUsingMockData()) {
        return analyticsApi.getPerformanceMetrics();
      }
      return apiClient.get(getApiUrl('analytics', '/performance'));
    },
  },

  // Notification endpoints
  notification: {
    getAll: async () => {
      if (isUsingMockData()) {
        return notificationApi.getAll();
      }
      return apiClient.get(getApiUrl('notification'));
    },

    getById: async (id: string) => {
      if (isUsingMockData()) {
        return notificationApi.getById(id);
      }
      return apiClient.get(getApiUrl('notification', `/${id}`));
    },

    markAsRead: async (id: string) => {
      if (isUsingMockData()) {
        return notificationApi.markAsRead(id);
      }
      return apiClient.patch(getApiUrl('notification', `/${id}/read`));
    },

    markAllAsRead: async () => {
      if (isUsingMockData()) {
        return notificationApi.markAllAsRead();
      }
      return apiClient.post(getApiUrl('notification', '/mark-all-read'));
    },

    delete: async (id: string) => {
      if (isUsingMockData()) {
        return notificationApi.delete(id);
      }
      return apiClient.delete(getApiUrl('notification', `/${id}`));
    },

    create: async (notificationData: any) => {
      if (isUsingMockData()) {
        return notificationApi.create(notificationData);
      }
      return apiClient.post(getApiUrl('notification'), notificationData);
    },
  },

  // Report endpoints
  report: {
    getAll: async () => {
      if (isUsingMockData()) {
        return reportApi.getAll();
      }
      return apiClient.get(getApiUrl('report'));
    },

    getById: async (id: string) => {
      if (isUsingMockData()) {
        return reportApi.getById(id);
      }
      return apiClient.get(getApiUrl('report', `/${id}`));
    },

    generate: async (type: string, params?: any) => {
      if (isUsingMockData()) {
        return reportApi.generate(type, params);
      }
      return apiClient.post(getApiUrl('report', '/generate'), { type, params });
    },

    export: async (id: string, format: string) => {
      if (isUsingMockData()) {
        return reportApi.export(id, format);
      }
      return apiClient.get(getApiUrl('report', `/${id}/export?format=${format}`));
    },

    delete: async (id: string) => {
      if (isUsingMockData()) {
        return reportApi.delete(id);
      }
      return apiClient.delete(getApiUrl('report', `/${id}`));
    },
  },
};

export default api;