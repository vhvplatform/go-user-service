/**
 * API Client Configuration
 * Axios instance with interceptors and error handling
 * Updated for Vite environment variables
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError, ApiResponse } from '../types/api.types';

// Get base URL from environment (Vite)
const getBaseURL = (): string => {
  const env = import.meta.env.VITE_ENVIRONMENT || 'local';
  
  const envUrls: Record<'local' | 'dev' | 'staging' | 'production', string> = {
    local: import.meta.env.VITE_API_URL_LOCAL || 'http://localhost:8080/api/v1',
    dev: import.meta.env.VITE_API_URL_DEV || 'https://dev-api.vhvplatform.com/api/v1',
    staging: import.meta.env.VITE_API_URL_STAGING || 'https://staging-api.vhvplatform.com/api/v1',
    production: import.meta.env.VITE_API_URL_PRODUCTION || 'https://api.vhvplatform.com/api/v1',
  };
  
  const envKey = env as 'local' | 'dev' | 'staging' | 'production';
  const base = envUrls[envKey] ?? envUrls.local;

  // Debug: print baseURL in dev for easier troubleshooting
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log(`[DEBUG][apiClient] Resolved baseURL: ${base} (env: ${env})`);
  }

  return base;
};

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'X-Tenant-ID': import.meta.env.VITE_TENANT_ID || 'tenant-123',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Ensure X-Tenant-ID is present and sourced from env if missing
    const tenantIdFromEnv = import.meta.env.VITE_TENANT_ID || 'tenant-123';
    if (config.headers && !config.headers['X-Tenant-ID']) {
      config.headers['X-Tenant-ID'] = tenantIdFromEnv;
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and refresh token
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.url}`, response.data);
    }
    
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        // Call refresh token endpoint
        const response = await axios.post<ApiResponse>(`${getBaseURL()}/auth/refresh`, {
          refreshToken,
        });
        
        const { accessToken } = response.data.data;
        
        // Update token in localStorage
        localStorage.setItem('accessToken', accessToken);
        
        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh token failed - logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        // Redirect to login
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other errors
    const errorResponse: ApiError = {
      success: false,
      message: error.response?.data?.message || 'An error occurred',
      error: error.response?.data?.error || error.message,
      statusCode: error.response?.status,
    };
    
    // Log error in development
    if (import.meta.env.DEV) {
      console.error('[API Error]', errorResponse);
    }
    
    return Promise.reject(errorResponse);
  }
);

export default apiClient;

// Export helper to update base URL dynamically
export function setEnvironment(env: string) {
  const envUrls: Record<string, string> = {
    local: import.meta.env.VITE_API_URL_LOCAL || 'http://localhost:8080/api/v1',
    dev: import.meta.env.VITE_API_URL_DEV || 'https://dev-api.vhvplatform.com/api/v1',
    staging: import.meta.env.VITE_API_URL_STAGING || 'https://staging-api.vhvplatform.com/api/v1',
    production: import.meta.env.VITE_API_URL_PRODUCTION || 'https://api.vhvplatform.com/api/v1',
  };
  
  apiClient.defaults.baseURL = envUrls[env] || envUrls.local;
  console.log(`[API Client] Environment set to: ${env}, Base URL: ${apiClient.defaults.baseURL}`);
}

// Helper to check if using mock data
export function isMockMode(): boolean {
  const mockApiEnv = import.meta.env.VITE_USE_MOCK_API;
  
  // If env var is explicitly set, use it
  if (mockApiEnv !== undefined && mockApiEnv !== '') {
    const isMock = mockApiEnv === 'true' || mockApiEnv === true;
    if (import.meta.env.DEV) {
      console.log(
        `[API Client] 🔧 Mock Mode: ${isMock ? '✅ ENABLED' : '❌ DISABLED'} (from .env)`
      );
    }
    return isMock;
  }
  
  // Fallback: Use mock mode in development if .env is not configured
  // This prevents Network Errors when backend is not available
  const isDev = import.meta.env.DEV;
  const environment = import.meta.env.VITE_ENVIRONMENT || 'local';
  
  // Default to mock mode in local development
  if (isDev && environment === 'local') {
    console.warn(
      '[API Client] ⚠️ VITE_USE_MOCK_API not configured in .env file.\n' +
      'Defaulting to MOCK mode to prevent Network Errors.\n' +
      'To fix this warning:\n' +
      '1. Ensure .env file exists in project root\n' +
      '2. Add: VITE_USE_MOCK_API=true\n' +
      '3. Restart dev server: npm run dev'
    );
    return true;
  }
  
  return false;
}