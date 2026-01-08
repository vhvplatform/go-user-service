/**
 * Security Utilities
 * Handles encryption, validation, and security measures
 */

import { env } from '../config/env';

/**
 * Simple AES-like encryption for tokens (client-side)
 * Note: This is basic obfuscation. For production, consider using crypto-js
 */
export function encryptToken(token: string): string {
  if (!env.tokenEncryptionKey) return token;
  
  try {
    // Simple XOR encryption (upgrade to AES in production)
    const key = env.tokenEncryptionKey;
    let encrypted = '';
    
    for (let i = 0; i < token.length; i++) {
      const charCode = token.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      encrypted += String.fromCharCode(charCode);
    }
    
    return btoa(encrypted); // Base64 encode
  } catch (error) {
    console.error('Encryption error:', error);
    return token;
  }
}

/**
 * Decrypt token
 */
export function decryptToken(encryptedToken: string): string {
  if (!env.tokenEncryptionKey) return encryptedToken;
  
  try {
    const key = env.tokenEncryptionKey;
    const decoded = atob(encryptedToken); // Base64 decode
    let decrypted = '';
    
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      decrypted += String.fromCharCode(charCode);
    }
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedToken;
  }
}

/**
 * Sanitize input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * Returns: { valid: boolean, message: string }
 */
export function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }
  
  return { valid: true, message: 'Password is strong' };
}

/**
 * Generate request signature for API calls
 */
export function generateRequestSignature(
  method: string,
  url: string,
  timestamp: number,
  body?: any
): string {
  if (!env.enableRequestSigning) return '';
  
  const data = `${method}|${url}|${timestamp}|${body ? JSON.stringify(body) : ''}`;
  
  // Simple hash (upgrade to HMAC-SHA256 in production)
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return Math.abs(hash).toString(16);
}

/**
 * Validate API response signature
 */
export function validateResponseSignature(
  data: any,
  signature: string
): boolean {
  if (!env.enableRequestSigning) return true;
  
  // Implement response signature validation
  // This should match the server's signing algorithm
  return true; // Placeholder
}

/**
 * Check if running in secure context (HTTPS)
 */
export function isSecureContext(): boolean {
  if (typeof window === 'undefined') return true;
  
  // Allow localhost for development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return true;
  }
  
  return window.location.protocol === 'https:';
}

/**
 * Enforce HTTPS if required
 */
export function enforceHTTPS(): void {
  if (!env.forceHttps) return;
  
  if (!isSecureContext()) {
    const httpsUrl = window.location.href.replace('http://', 'https://');
    window.location.replace(httpsUrl);
  }
}

/**
 * Check for session timeout
 */
export function isSessionExpired(lastActivityTime: number): boolean {
  const now = Date.now();
  const elapsed = now - lastActivityTime;
  return elapsed > env.sessionTimeout;
}

/**
 * Update last activity time
 */
export function updateLastActivity(): void {
  try {
    sessionStorage.setItem('lastActivity', Date.now().toString());
  } catch (error) {
    console.error('Failed to update activity:', error);
  }
}

/**
 * Get last activity time
 */
export function getLastActivity(): number {
  try {
    const lastActivity = sessionStorage.getItem('lastActivity');
    return lastActivity ? parseInt(lastActivity, 10) : Date.now();
  } catch {
    return Date.now();
  }
}

/**
 * Clear sensitive data from memory
 */
export function clearSensitiveData(): void {
  try {
    // Clear localStorage sensitive data
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Clear any cached data
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
  } catch (error) {
    console.error('Failed to clear sensitive data:', error);
  }
}

/**
 * Detect potential XSS in user input
 */
export function detectXSS(input: string): boolean {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
  ];
  
  return xssPatterns.some(pattern => pattern.test(input));
}

/**
 * Rate limiting check (client-side)
 */
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(endpoint: string): boolean {
  const now = Date.now();
  const key = endpoint;
  
  let record = requestCounts.get(key);
  
  // Reset if window expired
  if (!record || now > record.resetTime) {
    record = {
      count: 0,
      resetTime: now + env.rateLimitWindowMs,
    };
    requestCounts.set(key, record);
  }
  
  // Check limit
  if (record.count >= env.rateLimitMaxRequests) {
    return false; // Rate limit exceeded
  }
  
  // Increment count
  record.count++;
  return true;
}

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(token: string): boolean {
  try {
    const storedToken = sessionStorage.getItem('csrf_token');
    return token === storedToken;
  } catch {
    return false;
  }
}

/**
 * Set Content Security Policy headers (meta tag)
 */
export function setCSPMetaTag(): void {
  if (!env.cspEnabled) return;
  
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' " + env.apiBaseUrl,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
  
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = csp;
  document.head.appendChild(meta);
}

/**
 * Log security event
 */
export function logSecurityEvent(
  event: string,
  details?: any
): void {
  if (!env.debug.enabled) return;
  
  console.warn('🔒 Security Event:', {
    event,
    details,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
  });
  
  // Send to error reporting service if enabled
  if (env.enableErrorReporting && env.errorReportingUrl) {
    fetch(env.errorReportingUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'security_event',
        event,
        details,
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {
      // Silent fail
    });
  }
}
