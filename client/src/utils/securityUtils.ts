/**
 * Security Utilities
 * Provides security-related helper functions
 * 
 * IMPORTANT: This is client-side security (defense in depth)
 * PRIMARY security MUST be implemented on backend!
 */

import { isProduction } from '../config/api.config';

/**
 * Sensitive field names to redact
 */
const SENSITIVE_FIELDS = [
  'password',
  'token',
  'secret',
  'apiKey',
  'api_key',
  'accessToken',
  'access_token',
  'refreshToken',
  'refresh_token',
  'authToken',
  'auth_token',
  'privateKey',
  'private_key',
  'encryptionKey',
  'encryption_key',
  'creditCard',
  'credit_card',
  'ssn',
  'socialSecurity',
  'cvv',
  'pin',
] as const;

/**
 * Redact sensitive data from object
 * Useful for logging without exposing secrets
 */
export function redactSensitiveData<T extends Record<string, any>>(
  data: T,
  additionalFields: string[] = []
): T {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const fieldsToRedact = [...SENSITIVE_FIELDS, ...additionalFields];
  const redacted = { ...data };

  for (const key in redacted) {
    // Check if field name contains sensitive keywords
    const isFieldSensitive = fieldsToRedact.some(
      field => key.toLowerCase().includes(field.toLowerCase())
    );

    if (isFieldSensitive) {
      redacted[key] = '***REDACTED***';
    } else if (typeof redacted[key] === 'object' && redacted[key] !== null) {
      // Recursively redact nested objects
      redacted[key] = redactSensitiveData(redacted[key], additionalFields);
    }
  }

  return redacted;
}

/**
 * Sanitize HTML to prevent XSS
 * Basic sanitization - for production use DOMPurify
 */
export function sanitizeHtml(html: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return html.replace(/[&<>"'/]/g, char => map[char] || char);
}

/**
 * Escape special characters for use in regex
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Generate secure random string
 * Uses crypto.getRandomValues for cryptographically secure randomness
 */
export function generateSecureRandomString(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate CSRF token (client-side)
 * Note: Backend should validate this
 */
export function generateCsrfToken(): string {
  const token = generateSecureRandomString(32);
  sessionStorage.setItem('csrf_token', token);
  return token;
}

/**
 * Get CSRF token
 */
export function getCsrfToken(): string | null {
  return sessionStorage.getItem('csrf_token');
}

/**
 * Validate email format (basic)
 * Backend should have comprehensive validation
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check password strength
 * Returns score from 0 (weak) to 4 (very strong)
 */
export function getPasswordStrength(password: string): {
  score: number;
  feedback: string[];
} {
  let score = 0;
  const feedback: string[] = [];

  if (!password) {
    return { score: 0, feedback: ['Mật khẩu không được để trống'] };
  }

  // Length check
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length < 8) {
    feedback.push('Mật khẩu cần ít nhất 8 ký tự');
  }

  // Character variety
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score++;
  } else {
    feedback.push('Cần có cả chữ hoa và chữ thường');
  }

  if (/[0-9]/.test(password)) {
    score++;
  } else {
    feedback.push('Cần có ít nhất 1 số');
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score++;
  } else {
    feedback.push('Nên có ký tự đặc biệt (!@#$%^&*)');
  }

  // Common password check
  const commonPasswords = ['password', '123456', 'qwerty', 'admin', '12345678'];
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    score = Math.max(0, score - 2);
    feedback.push('Mật khẩu quá phổ biến, dễ bị đoán');
  }

  // Normalize score to 0-4
  score = Math.min(4, score);

  if (score >= 4) {
    feedback.length = 0;
    feedback.push('Mật khẩu rất mạnh');
  } else if (score >= 3) {
    feedback.length = 0;
    feedback.push('Mật khẩu khá mạnh');
  }

  return { score, feedback };
}

/**
 * Hash data using SHA-256
 * Note: For passwords, use bcrypt on backend!
 * This is for client-side integrity checks only
 */
export async function hashSHA256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Check if running in secure context (HTTPS)
 */
export function isSecureContext(): boolean {
  return window.isSecureContext;
}

/**
 * Validate URL to prevent open redirect attacks
 */
export function isSafeUrl(url: string, allowedDomains: string[] = []): boolean {
  try {
    const urlObj = new URL(url, window.location.origin);
    
    // Only allow http(s) protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }

    // If no allowed domains specified, only allow same origin
    if (allowedDomains.length === 0) {
      return urlObj.origin === window.location.origin;
    }

    // Check if domain is in allowed list
    return allowedDomains.some(domain => 
      urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

/**
 * Rate limiter (client-side)
 * Note: Backend MUST have proper rate limiting!
 * This is just to reduce unnecessary requests
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * Check if request is allowed
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    // Add current request
    validRequests.push(now);
    this.requests.set(key, validRequests);
    
    return true;
  }

  /**
   * Get remaining requests
   */
  getRemainingRequests(key: string): number {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    return Math.max(0, this.maxRequests - validRequests.length);
  }

  /**
   * Reset rate limit for key
   */
  reset(key: string): void {
    this.requests.delete(key);
  }

  /**
   * Clear all rate limits
   */
  clearAll(): void {
    this.requests.clear();
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter();

/**
 * Session timeout checker
 */
export class SessionTimeoutChecker {
  private timeoutId: number | null = null;
  private lastActivityTime: number = Date.now();
  private timeoutMs: number;
  private onTimeout: () => void;

  constructor(timeoutMs: number = 3600000, onTimeout: () => void) {
    this.timeoutMs = timeoutMs;
    this.onTimeout = onTimeout;
    this.setupActivityListeners();
    this.startTimer();
  }

  private setupActivityListeners(): void {
    // Reset timer on user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, () => this.resetTimer(), { passive: true });
    });
  }

  private startTimer(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = window.setTimeout(() => {
      this.onTimeout();
    }, this.timeoutMs);
  }

  resetTimer(): void {
    this.lastActivityTime = Date.now();
    this.startTimer();
  }

  getRemainingTime(): number {
    const elapsed = Date.now() - this.lastActivityTime;
    return Math.max(0, this.timeoutMs - elapsed);
  }

  destroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}

/**
 * Get safe error message for display
 * Hides technical details in production
 */
export function getSafeErrorMessage(error: any): string {
  if (isProduction()) {
    // Generic message in production
    return 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
  }

  // Detailed message in development
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Unknown error occurred';
}

/**
 * Validate file type (basic check)
 * For robust validation, use magic bytes on backend
 */
export function isValidFileType(
  file: File,
  allowedTypes: string[]
): { valid: boolean; error?: string } {
  // Check MIME type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed`,
    };
  }

  // Check extension (can be spoofed, backend should verify)
  const extension = file.name.split('.').pop()?.toLowerCase();
  const allowedExtensions = allowedTypes.map(type => type.split('/')[1]);
  
  if (!extension || !allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: `File extension .${extension} is not allowed`,
    };
  }

  return { valid: true };
}

/**
 * Validate file size
 */
export function isValidFileSize(
  file: File,
  maxSizeBytes: number
): { valid: boolean; error?: string } {
  if (file.size > maxSizeBytes) {
    const maxSizeMB = (maxSizeBytes / 1024 / 1024).toFixed(2);
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB} MB`,
    };
  }

  return { valid: true };
}

/**
 * Content Security Policy violation reporter
 */
export function setupCSPReporting(reportUrl: string): void {
  document.addEventListener('securitypolicyviolation', (e) => {
    const violation = {
      documentUri: e.documentURI,
      violatedDirective: e.violatedDirective,
      blockedUri: e.blockedURI,
      lineNumber: e.lineNumber,
      columnNumber: e.columnNumber,
      sourceFile: e.sourceFile,
      timestamp: new Date().toISOString(),
    };

    // Send to reporting endpoint
    fetch(reportUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(violation),
    }).catch(err => console.error('Failed to report CSP violation:', err));
  });
}

/**
 * Prevent clickjacking
 */
export function preventClickjacking(): void {
  if (window.top !== window.self) {
    // Page is in an iframe
    window.top!.location = window.self.location;
  }
}

/**
 * Secure localStorage wrapper
 * Adds basic obfuscation (NOT encryption!)
 * For real encryption, use a library and do it server-side
 */
export const secureStorage = {
  setItem(key: string, value: string): void {
    try {
      // Basic obfuscation (NOT secure encryption)
      const obfuscated = btoa(value);
      localStorage.setItem(key, obfuscated);
    } catch (error) {
      console.error('Failed to save to secure storage:', error);
    }
  },

  getItem(key: string): string | null {
    try {
      const obfuscated = localStorage.getItem(key);
      if (!obfuscated) return null;
      
      return atob(obfuscated);
    } catch (error) {
      console.error('Failed to read from secure storage:', error);
      return null;
    }
  },

  removeItem(key: string): void {
    localStorage.removeItem(key);
  },

  clear(): void {
    localStorage.clear();
  },
};

export default {
  redactSensitiveData,
  sanitizeHtml,
  escapeRegex,
  generateSecureRandomString,
  generateCsrfToken,
  getCsrfToken,
  isValidEmail,
  getPasswordStrength,
  hashSHA256,
  isSecureContext,
  isSafeUrl,
  rateLimiter,
  SessionTimeoutChecker,
  getSafeErrorMessage,
  isValidFileType,
  isValidFileSize,
  setupCSPReporting,
  preventClickjacking,
  secureStorage,
};
