/**
 * API Client with automatic header injection
 * Handles all HTTP requests with tenant-specific headers
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { env } from '../config/env';
import { toast } from 'sonner';
import {
  encryptToken,
  decryptToken,
  generateRequestSignature,
  checkRateLimit,
  updateLastActivity,
  isSessionExpired,
  getLastActivity,
  clearSensitiveData,
  detectXSS,
  logSecurityEvent,
  sanitizeInput,
} from './security-utils';

/**
 * API Response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
  };
}

/**
 * API Error response
 */
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

/**
 * Request options
 */
export interface RequestOptions extends AxiosRequestConfig {
  skipAuth?: boolean;
  skipTenant?: boolean;
  showErrorToast?: boolean;
}

/**
 * Create base axios instance
 */
function createAxiosInstance(baseURL: string): AxiosInstance {
  const instance = axios.create({
    baseURL,
    timeout: env.apiTimeout,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  // Request interceptor - Add headers
  instance.interceptors.request.use(
    (config) => {
      // Add X-Tenant-ID header from environment
      if (!config.headers['X-Tenant-ID']) {
        config.headers['X-Tenant-ID'] = env.tenantId;
      }

      // Add Authorization token if exists
      const token = getAuthToken();
      if (token && !config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      // Add request ID for tracing
      config.headers['X-Request-ID'] = generateRequestId();

      // Add app version
      config.headers['X-App-Version'] = env.appVersion;

      // Log request in debug mode
      if (env.debug.enabled) {
        console.log('🚀 API Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          headers: config.headers,
          data: config.data,
        });
      }

      return config;
    },
    (error) => {
      console.error('❌ Request Error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor - Handle errors
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log response in debug mode
      if (env.debug.enabled) {
        console.log('✅ API Response:', {
          status: response.status,
          url: response.config.url,
          data: response.data,
        });
      }

      return response;
    },
    (error: AxiosError) => {
      handleApiError(error);
      return Promise.reject(error);
    }
  );

  return instance;
}

/**
 * Get authentication token from storage
 */
function getAuthToken(): string | null {
  try {
    return localStorage.getItem('auth_token');
  } catch {
    return null;
  }
}

/**
 * Set authentication token
 */
export function setAuthToken(token: string): void {
  try {
    localStorage.setItem('auth_token', token);
  } catch (error) {
    console.error('Failed to save auth token:', error);
  }
}

/**
 * Remove authentication token
 */
export function removeAuthToken(): void {
  try {
    localStorage.removeItem('auth_token');
  } catch (error) {
    console.error('Failed to remove auth token:', error);
  }
}

/**
 * Generate unique request ID
 */
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Handle API errors
 */
function handleApiError(error: AxiosError): void {
  const status = error.response?.status;
  const data = error.response?.data as any;

  let errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại sau.';

  switch (status) {
    case 400:
      errorMessage = data?.message || 'Yêu cầu không hợp lệ';
      break;
    case 401:
      errorMessage = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
      removeAuthToken();
      // Redirect to login if needed
      window.location.href = '/login';
      break;
    case 403:
      errorMessage = 'Bạn không có quyền thực hiện thao tác này';
      break;
    case 404:
      errorMessage = 'Không tìm thấy dữ liệu';
      break;
    case 409:
      errorMessage = data?.message || 'Dữ liệu đã tồn tại';
      break;
    case 422:
      errorMessage = data?.message || 'Dữ liệu không hợp lệ';
      break;
    case 429:
      errorMessage = 'Quá nhiều yêu cầu. Vui lòng thử lại sau.';
      break;
    case 500:
      errorMessage = 'Lỗi máy chủ. Vui lòng liên hệ quản trị viên.';
      break;
    case 503:
      errorMessage = 'Dịch vụ tạm thời không khả dụng';
      break;
    default:
      errorMessage = data?.message || error.message || errorMessage;
  }

  // Log error
  console.error('❌ API Error:', {
    status,
    message: errorMessage,
    url: error.config?.url,
    data: data,
  });

  // Show toast notification
  if (status !== 401) { // Don't show toast for auth errors (we redirect)
    toast.error(errorMessage);
  }
}

/**
 * API Client class
 */
class ApiClient {
  private instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = createAxiosInstance(baseURL);
  }

  /**
   * GET request
   */
  async get<T = any>(url: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.get<T>(url, options);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: (error as any).message,
      };
    }
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.post<T>(url, data, options);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: (error as any).message,
      };
    }
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.put<T>(url, data, options);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: (error as any).message,
      };
    }
  }

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.patch<T>(url, data, options);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: (error as any).message,
      };
    }
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.delete<T>(url, options);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: (error as any).message,
      };
    }
  }

  /**
   * Get raw axios instance for custom requests
   */
  getRawInstance(): AxiosInstance {
    return this.instance;
  }
}

/**
 * Create API client instances for different services
 */
export const apiClient = new ApiClient(env.apiBaseUrl);
export const userServiceClient = new ApiClient(env.userServiceUrl);
export const authServiceClient = new ApiClient(env.authServiceUrl);
export const fileServiceClient = new ApiClient(env.fileServiceUrl);

/**
 * Default export
 */
export default apiClient;