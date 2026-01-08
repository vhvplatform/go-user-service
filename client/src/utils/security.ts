/**
 * Security Utilities
 * CRITICAL: These utilities help prevent common security vulnerabilities
 */

/**
 * Sanitize HTML to prevent XSS attacks
 * Use DOMPurify library for production
 */
export function sanitizeHtml(dirty: string): string {
  // Basic sanitization - replace with DOMPurify in production
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  
  return dirty.replace(/[&<>"'/]/g, (char) => map[char]);
}

/**
 * Escape SQL special characters (use parameterized queries instead!)
 */
export function escapeSql(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\x00/g, '\\0')
    .replace(/\x1a/g, '\\Z');
}

/**
 * Generate CSRF token
 */
export function generateCsrfToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate CSRF token
 */
export function validateCsrfToken(token: string, storedToken: string): boolean {
  if (!token || !storedToken) return false;
  
  // Constant-time comparison to prevent timing attacks
  if (token.length !== storedToken.length) return false;
  
  let result = 0;
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ storedToken.charCodeAt(i);
  }
  
  return result === 0;
}

/**
 * Hash sensitive data (client-side - NOT for passwords!)
 * Use for fingerprinting, cache keys, etc.
 */
export async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Secure random string generation
 */
export function generateSecureRandom(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Check password strength
 */
export interface PasswordStrength {
  score: number; // 0-5
  feedback: string[];
  isValid: boolean;
}

export function checkPasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = [];
  let score = 0;

  if (!password) {
    return { score: 0, feedback: ['Password is required'], isValid: false };
  }

  // Length check
  if (password.length < 8) {
    feedback.push('Password should be at least 8 characters');
  } else if (password.length >= 12) {
    score += 2;
  } else {
    score += 1;
  }

  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    feedback.push('Add uppercase letters');
  } else {
    score += 1;
  }

  // Lowercase check
  if (!/[a-z]/.test(password)) {
    feedback.push('Add lowercase letters');
  } else {
    score += 1;
  }

  // Number check
  if (!/[0-9]/.test(password)) {
    feedback.push('Add numbers');
  } else {
    score += 1;
  }

  // Special character check
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    feedback.push('Add special characters');
  } else {
    score += 1;
  }

  // Common password check
  const commonPasswords = [
    'password', '12345678', 'qwerty', 'abc123', 'monkey',
    'letmein', 'welcome', 'admin', 'user', '123456789',
  ];
  
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    feedback.push('Avoid common passwords');
    score = Math.max(0, score - 2);
  }

  const isValid = score >= 3 && password.length >= 8;

  return { score, feedback, isValid };
}

/**
 * Redact sensitive data for logging
 */
export function redactSensitiveData(obj: any): any {
  const sensitiveKeys = [
    'password', 'token', 'secret', 'apiKey', 'api_key',
    'accessToken', 'refreshToken', 'authorization',
    'creditCard', 'ssn', 'pin', 'cvv',
  ];

  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => redactSensitiveData(item));
  }

  const redacted: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const keyLower = key.toLowerCase();
    
    if (sensitiveKeys.some(sensitive => keyLower.includes(sensitive))) {
      redacted[key] = '***REDACTED***';
    } else if (typeof value === 'object' && value !== null) {
      redacted[key] = redactSensitiveData(value);
    } else {
      redacted[key] = value;
    }
  }

  return redacted;
}

/**
 * Validate and sanitize URL
 */
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Invalid protocol');
    }
    
    return parsed.toString();
  } catch {
    return '';
  }
}

/**
 * Prevent clickjacking by checking if in iframe
 */
export function preventClickjacking(): boolean {
  if (window.self !== window.top) {
    // Page is in an iframe - potential clickjacking attempt
    console.warn('Clickjacking attempt detected');
    return false;
  }
  return true;
}

/**
 * Secure session storage wrapper
 */
export const SecureStorage = {
  /**
   * Set item with expiration
   */
  setItem(key: string, value: any, expiresInMinutes?: number): void {
    const item = {
      value,
      timestamp: Date.now(),
      expires: expiresInMinutes ? Date.now() + (expiresInMinutes * 60 * 1000) : null,
    };
    
    try {
      sessionStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Failed to store item:', error);
    }
  },

  /**
   * Get item with expiration check
   */
  getItem(key: string): any {
    try {
      const itemStr = sessionStorage.getItem(key);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);
      
      // Check if expired
      if (item.expires && Date.now() > item.expires) {
        sessionStorage.removeItem(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.error('Failed to retrieve item:', error);
      return null;
    }
  },

  /**
   * Remove item
   */
  removeItem(key: string): void {
    sessionStorage.removeItem(key);
  },

  /**
   * Clear all items
   */
  clear(): void {
    sessionStorage.clear();
  },
};

/**
 * Rate limiter for client-side
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  /**
   * Check if action is allowed
   * @param key - Unique identifier for the action
   * @param maxRequests - Maximum requests allowed
   * @param windowMs - Time window in milliseconds
   */
  isAllowed(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;

    // Get existing requests for this key
    let timestamps = this.requests.get(key) || [];

    // Remove old timestamps outside the window
    timestamps = timestamps.filter(time => time > windowStart);

    // Check if limit exceeded
    if (timestamps.length >= maxRequests) {
      return false;
    }

    // Add current timestamp
    timestamps.push(now);
    this.requests.set(key, timestamps);

    return true;
  }

  /**
   * Get remaining requests
   */
  getRemaining(key: string, maxRequests: number, windowMs: number): number {
    const now = Date.now();
    const windowStart = now - windowMs;

    let timestamps = this.requests.get(key) || [];
    timestamps = timestamps.filter(time => time > windowStart);

    return Math.max(0, maxRequests - timestamps.length);
  }

  /**
   * Reset rate limit for a key
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

/**
 * Validate Content-Type to prevent MIME confusion attacks
 */
export function validateContentType(contentType: string, expected: string[]): boolean {
  const normalized = contentType.toLowerCase().split(';')[0].trim();
  return expected.some(type => normalized === type.toLowerCase());
}

/**
 * Generate device fingerprint (for fraud detection)
 */
export async function generateDeviceFingerprint(): Promise<string> {
  const components = [
    navigator.userAgent,
    navigator.language,
    new Date().getTimezoneOffset(),
    screen.width,
    screen.height,
    screen.colorDepth,
  ];

  const fingerprint = components.join('|');
  return await hashData(fingerprint);
}

/**
 * Detect potential XSS in string
 */
export function detectXss(input: string): boolean {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /eval\(/gi,
  ];

  return xssPatterns.some(pattern => pattern.test(input));
}

/**
 * Safe JSON parse with error handling
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * Constant-time string comparison (prevent timing attacks)
 */
export function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

export default {
  sanitizeHtml,
  escapeSql,
  generateCsrfToken,
  validateCsrfToken,
  hashData,
  generateSecureRandom,
  checkPasswordStrength,
  redactSensitiveData,
  sanitizeUrl,
  preventClickjacking,
  SecureStorage,
  RateLimiter,
  validateContentType,
  generateDeviceFingerprint,
  detectXss,
  safeJsonParse,
  constantTimeEqual,
};
