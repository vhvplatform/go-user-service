/**
 * Authentication Service
 * SECURITY: Implements secure authentication with JWT, refresh tokens, and CSRF protection
 */

import { buildApiUrl, getDefaultHeaders } from '../config/api.config';
import { generateCsrfToken, SecureStorage, RateLimiter } from '../utils/security';
import type { User } from './api';

/**
 * Authentication Response
 */
export interface AuthResponse {
  success: boolean;
  user?: User;
  accessToken?: string;
  message?: string;
  error?: string;
}

/**
 * Login Credentials
 */
export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Register Payload
 */
export interface RegisterPayload {
  username: string;
  email: string;
  fullName: string;
  password: string;
}

/**
 * Session Configuration
 */
const SESSION_CONFIG = {
  ACCESS_TOKEN_KEY: 'access_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  USER_KEY: 'current_user',
  CSRF_TOKEN_KEY: 'csrf_token',
  SESSION_TIMEOUT_MINUTES: 30,
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_ATTEMPT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
};

/**
 * Rate limiter for login attempts
 */
const loginRateLimiter = new RateLimiter();

/**
 * Authentication Service Class
 */
class AuthService {
  private sessionTimeout: NodeJS.Timeout | null = null;
  private currentUser: User | null = null;

  /**
   * Initialize auth service
   */
  constructor() {
    this.initSession();
    this.setupSessionTimeout();
  }

  /**
   * Initialize session from storage
   */
  private initSession(): void {
    try {
      const userStr = SecureStorage.getItem(SESSION_CONFIG.USER_KEY);
      if (userStr) {
        this.currentUser = JSON.parse(userStr);
      }
    } catch (error) {
      console.error('Failed to init session:', error);
      this.clearSession();
    }
  }

  /**
   * Setup automatic session timeout
   */
  private setupSessionTimeout(): void {
    // Clear existing timeout
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
    }

    // Set new timeout
    this.sessionTimeout = setTimeout(() => {
      this.logout('Session expired');
    }, SESSION_CONFIG.SESSION_TIMEOUT_MINUTES * 60 * 1000);
  }

  /**
   * Reset session timeout (call on user activity)
   */
  private resetSessionTimeout(): void {
    this.setupSessionTimeout();
  }

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Check rate limiting
      const canAttempt = loginRateLimiter.isAllowed(
        `login:${credentials.username}`,
        SESSION_CONFIG.MAX_LOGIN_ATTEMPTS,
        SESSION_CONFIG.LOGIN_ATTEMPT_WINDOW_MS
      );

      if (!canAttempt) {
        const remaining = loginRateLimiter.getRemaining(
          `login:${credentials.username}`,
          SESSION_CONFIG.MAX_LOGIN_ATTEMPTS,
          SESSION_CONFIG.LOGIN_ATTEMPT_WINDOW_MS
        );

        return {
          success: false,
          error: `Too many login attempts. Please try again in ${Math.ceil(SESSION_CONFIG.LOGIN_ATTEMPT_WINDOW_MS / 60000)} minutes.`,
        };
      }

      // SECURITY: Never log passwords
      const safeCredentials = { ...credentials, password: '***REDACTED***' };
      console.log('[Auth] Login attempt:', safeCredentials);

      // Generate CSRF token
      const csrfToken = generateCsrfToken();
      
      // Call login API
      const response = await fetch(buildApiUrl('/login', 'auth'), {
        method: 'POST',
        headers: {
          ...getDefaultHeaders(),
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password, // Will be hashed on server
          csrfToken,
        }),
        credentials: 'include', // Important for httpOnly cookies
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        return {
          success: false,
          error: error.message || 'Login failed',
        };
      }

      const data: AuthResponse = await response.json();

      if (data.success && data.user && data.accessToken) {
        // Store user and tokens securely
        this.setSession(data.user, data.accessToken, csrfToken);

        // Reset rate limiter on successful login
        loginRateLimiter.reset(`login:${credentials.username}`);

        return {
          success: true,
          user: data.user,
          message: 'Login successful',
        };
      }

      return {
        success: false,
        error: 'Invalid credentials',
      };
    } catch (error) {
      console.error('[Auth] Login error:', error);
      return {
        success: false,
        error: 'Login failed. Please try again.',
      };
    }
  }

  /**
   * Register new user
   */
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    try {
      // SECURITY: Never log passwords
      const safePayload = { ...payload, password: '***REDACTED***' };
      console.log('[Auth] Register attempt:', safePayload);

      const csrfToken = generateCsrfToken();

      const response = await fetch(buildApiUrl('/register', 'auth'), {
        method: 'POST',
        headers: {
          ...getDefaultHeaders(),
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({
          ...payload,
          csrfToken,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        return {
          success: false,
          error: error.message || 'Registration failed',
        };
      }

      const data: AuthResponse = await response.json();

      if (data.success && data.user && data.accessToken) {
        this.setSession(data.user, data.accessToken, csrfToken);

        return {
          success: true,
          user: data.user,
          message: 'Registration successful',
        };
      }

      return data;
    } catch (error) {
      console.error('[Auth] Register error:', error);
      return {
        success: false,
        error: 'Registration failed. Please try again.',
      };
    }
  }

  /**
   * Logout user
   */
  async logout(reason?: string): Promise<void> {
    try {
      // Call logout API
      await fetch(buildApiUrl('/logout', 'auth'), {
        method: 'POST',
        headers: getDefaultHeaders(),
        credentials: 'include',
      }).catch(() => {
        // Ignore errors - clear session anyway
      });

      // Clear session
      this.clearSession();

      if (reason) {
        console.log(`[Auth] Logged out: ${reason}`);
      }
    } catch (error) {
      console.error('[Auth] Logout error:', error);
      // Clear session anyway
      this.clearSession();
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch(buildApiUrl('/refresh', 'auth'), {
        method: 'POST',
        headers: getDefaultHeaders(),
        credentials: 'include', // Sends httpOnly refresh token cookie
      });

      if (!response.ok) {
        this.logout('Token refresh failed');
        return false;
      }

      const data = await response.json();

      if (data.accessToken) {
        SecureStorage.setItem(
          SESSION_CONFIG.ACCESS_TOKEN_KEY,
          data.accessToken,
          SESSION_CONFIG.SESSION_TIMEOUT_MINUTES
        );
        
        this.resetSessionTimeout();
        return true;
      }

      return false;
    } catch (error) {
      console.error('[Auth] Token refresh error:', error);
      this.logout('Token refresh failed');
      return false;
    }
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.currentUser && !!this.getAccessToken();
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return SecureStorage.getItem(SESSION_CONFIG.ACCESS_TOKEN_KEY);
  }

  /**
   * Get CSRF token
   */
  getCsrfToken(): string | null {
    return SecureStorage.getItem(SESSION_CONFIG.CSRF_TOKEN_KEY);
  }

  /**
   * Set session data
   */
  private setSession(user: User, accessToken: string, csrfToken: string): void {
    this.currentUser = user;

    // Store in secure session storage with expiration
    SecureStorage.setItem(
      SESSION_CONFIG.USER_KEY,
      JSON.stringify(user),
      SESSION_CONFIG.SESSION_TIMEOUT_MINUTES
    );
    
    SecureStorage.setItem(
      SESSION_CONFIG.ACCESS_TOKEN_KEY,
      accessToken,
      SESSION_CONFIG.SESSION_TIMEOUT_MINUTES
    );
    
    SecureStorage.setItem(
      SESSION_CONFIG.CSRF_TOKEN_KEY,
      csrfToken,
      SESSION_CONFIG.SESSION_TIMEOUT_MINUTES
    );

    // Setup session timeout
    this.setupSessionTimeout();
  }

  /**
   * Clear session data
   */
  private clearSession(): void {
    this.currentUser = null;
    
    SecureStorage.removeItem(SESSION_CONFIG.USER_KEY);
    SecureStorage.removeItem(SESSION_CONFIG.ACCESS_TOKEN_KEY);
    SecureStorage.removeItem(SESSION_CONFIG.CSRF_TOKEN_KEY);

    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
      this.sessionTimeout = null;
    }
  }

  /**
   * Password change
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<AuthResponse> {
    try {
      if (!this.isAuthenticated()) {
        return {
          success: false,
          error: 'Not authenticated',
        };
      }

      const response = await fetch(buildApiUrl('/change-password', 'auth'), {
        method: 'POST',
        headers: {
          ...getDefaultHeaders(),
          'X-CSRF-Token': this.getCsrfToken() || '',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        return {
          success: false,
          error: error.message || 'Password change failed',
        };
      }

      // Force logout after password change
      await this.logout('Password changed');

      return {
        success: true,
        message: 'Password changed successfully. Please login again.',
      };
    } catch (error) {
      console.error('[Auth] Password change error:', error);
      return {
        success: false,
        error: 'Password change failed. Please try again.',
      };
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<AuthResponse> {
    try {
      const response = await fetch(buildApiUrl('/reset-password-request', 'auth'), {
        method: 'POST',
        headers: getDefaultHeaders(),
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        return {
          success: false,
          error: error.message || 'Request failed',
        };
      }

      return {
        success: true,
        message: 'Password reset instructions sent to your email',
      };
    } catch (error) {
      console.error('[Auth] Password reset request error:', error);
      return {
        success: false,
        error: 'Request failed. Please try again.',
      };
    }
  }

  /**
   * Activity tracking (call on user interaction to reset timeout)
   */
  trackActivity(): void {
    if (this.isAuthenticated()) {
      this.resetSessionTimeout();
    }
  }
}

// Export singleton instance
export const authService = new AuthService();

export default authService;
