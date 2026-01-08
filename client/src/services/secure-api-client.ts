/**
 * Secure API Client
 * Enhanced API client with comprehensive security features
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
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
  generateCSRFToken,
  validateCSRFToken,
} from './security-utils';

/**
 * Secure storage for tokens
 */
class SecureTokenStorage {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private static readonly CSRF_TOKEN_KEY = 'csrf_token';

  /**
   * Save auth token securely
   */
  static setToken(token: string): void {
    try {
      const encrypted = encryptToken(token);
      localStorage.setItem(this.TOKEN_KEY, encrypted);
      updateLastActivity();
    } catch (error) {
      logSecurityEvent('token_save_failed', { error });
      throw new Error('Failed to save authentication token');
    }
  }

  /**
   * Get auth token
   */
  static getToken(): string | null {
    try {
      // Check session timeout
      if (isSessionExpired(getLastActivity())) {
        logSecurityEvent('session_expired');
        this.clearAll();
        toast.error('Phiên đăng nhập đã hết hạn');
        window.location.href = '/login';
        return null;
      }

      const encrypted = localStorage.getItem(this.TOKEN_KEY);
      if (!encrypted) return null;

      const decrypted = decryptToken(encrypted);
      updateLastActivity();
      return decrypted;
    } catch (error) {
      logSecurityEvent('token_read_failed', { error });
      return null;
    }
  }

  /**
   * Set refresh token
   */
  static setRefreshToken(token: string): void {
    try {
      const encrypted = encryptToken(token);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, encrypted);
    } catch (error) {
      logSecurityEvent('refresh_token_save_failed', { error });
    }
  }

  /**
   * Get refresh token
   */
  static getRefreshToken(): string | null {
    try {
      const encrypted = localStorage.getItem(this.REFRESH_TOKEN_KEY);
      if (!encrypted) return null;
      return decryptToken(encrypted);
    } catch {
      return null;
    }
  }

  /**
   * Initialize CSRF token
   */
  static initCSRFToken(): void {
    try {
      const existing = sessionStorage.getItem(this.CSRF_TOKEN_KEY);
      if (!existing) {
        const token = generateCSRFToken();
        sessionStorage.setItem(this.CSRF_TOKEN_KEY, token);
      }
    } catch (error) {
      logSecurityEvent('csrf_init_failed', { error });
    }
  }

  /**
   * Get CSRF token
   */
  static getCSRFToken(): string | null {
    try {
      return sessionStorage.getItem(this.CSRF_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  /**
   * Clear all tokens
   */
  static clearAll(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      sessionStorage.removeItem(this.CSRF_TOKEN_KEY);
      clearSensitiveData();
    } catch (error) {
      logSecurityEvent('token_clear_failed', { error });
    }
  }
}

/**
 * Create secure axios instance
 */
function createSecureAxiosInstance(baseURL: string): AxiosInstance {
  const instance = axios.create({
    baseURL,
    timeout: env.apiTimeout,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    withCredentials: false, // Set to true if using cookies
  });

  // Request interceptor
  instance.interceptors.request.use(
    async (config) => {
      try {
        // Check rate limiting
        if (!checkRateLimit(config.url || '')) {
          logSecurityEvent('rate_limit_exceeded', { url: config.url });
          throw new Error('Rate limit exceeded. Please slow down.');
        }

        // XSS detection for request data
        if (config.data && typeof config.data === 'object') {
          const jsonData = JSON.stringify(config.data);
          if (detectXSS(jsonData)) {
            logSecurityEvent('xss_detected', { url: config.url, data: config.data });
            throw new Error('Potentially malicious content detected');
          }
        }

        // Add tenant ID
        config.headers['X-Tenant-ID'] = env.tenantId;

        // Add auth token
        const token = SecureTokenStorage.getToken();
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }

        // Add CSRF token for state-changing requests
        if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(config.method?.toUpperCase() || '')) {
          const csrfToken = SecureTokenStorage.getCSRFToken();
          if (csrfToken) {
            config.headers['X-CSRF-Token'] = csrfToken;
          }
        }

        // Add request signature if enabled
        if (env.enableRequestSigning) {
          const timestamp = Date.now();
          const signature = generateRequestSignature(
            config.method || 'GET',
            config.url || '',
            timestamp,
            config.data
          );
          config.headers['X-Request-Signature'] = signature;
          config.headers['X-Request-Timestamp'] = timestamp.toString();
        }

        // Add request ID for tracing
        config.headers['X-Request-ID'] = generateRequestId();

        // Add app version
        config.headers['X-App-Version'] = env.appVersion;

        // Add origin for CORS
        if (typeof window !== 'undefined') {
          config.headers['Origin'] = window.location.origin;
        }

        // Debug logging
        if (env.debug.enabled) {
          console.log('🔒 Secure API Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            headers: {
              ...config.headers,
              Authorization: token ? 'Bearer ***' : undefined,
            },
          });
        }

        return config;
      } catch (error) {
        logSecurityEvent('request_interceptor_error', { error });
        return Promise.reject(error);
      }
    },
    (error) => {
      logSecurityEvent('request_error', { error });
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      updateLastActivity();

      if (env.debug.enabled) {
        console.log('✅ Secure API Response:', {
          status: response.status,
          url: response.config.url,
        });
      }

      return response;
    },
    async (error) => {
      const status = error.response?.status;

      // Handle specific error codes
      switch (status) {
        case 401:
          // Unauthorized - try to refresh token
          logSecurityEvent('unauthorized_error', { url: error.config?.url });
          SecureTokenStorage.clearAll();
          toast.error('Phiên đăng nhập hết hạn');
          setTimeout(() => {
            window.location.href = '/login';
          }, 1000);
          break;

        case 403:
          logSecurityEvent('forbidden_error', { url: error.config?.url });
          toast.error('Bạn không có quyền truy cập');
          break;

        case 429:
          logSecurityEvent('rate_limited', { url: error.config?.url });
          toast.error('Quá nhiều yêu cầu. Vui lòng thử lại sau.');
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          logSecurityEvent('server_error', { 
            status, 
            url: error.config?.url 
          });
          toast.error('Lỗi máy chủ. Vui lòng thử lại sau.');
          break;

        default:
          if (error.message && status !== 401) {
            toast.error(error.response?.data?.message || error.message);
          }
      }

      return Promise.reject(error);
    }
  );

  return instance;
}

/**
 * Generate unique request ID
 */
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Secure API Client
 */
export class SecureApiClient {
  private instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = createSecureAxiosInstance(baseURL);
    SecureTokenStorage.initCSRFToken();
  }

  /**
   * Make secure GET request
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  /**
   * Make secure POST request
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  /**
   * Make secure PUT request
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  /**
   * Make secure PATCH request
   */
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    return response.data;
  }

  /**
   * Make secure DELETE request
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }

  /**
   * Get raw axios instance
   */
  getRawInstance(): AxiosInstance {
    return this.instance;
  }
}

/**
 * Secure token storage helper exports
 */
export const secureStorage = SecureTokenStorage;

/**
 * Create secure client instances
 */
export const secureApiClient = new SecureApiClient(env.apiBaseUrl);
export const secureUserClient = new SecureApiClient(env.userServiceUrl);
export const secureAuthClient = new SecureApiClient(env.authServiceUrl);

export default secureApiClient;
