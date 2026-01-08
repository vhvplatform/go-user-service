/**
 * String and Format Utilities
 * Helper functions for formatting and string manipulation
 */

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Capitalize each word
 */
export function capitalizeWords(str: string): string {
  if (!str) return '';
  return str.split(' ').map(capitalize).join(' ');
}

/**
 * Convert to title case
 */
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, maxLength: number, suffix: string = '...'): string {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Remove accents from Vietnamese text
 */
export function removeAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

/**
 * Slugify string (URL-friendly)
 */
export function slugify(str: string): string {
  return removeAccents(str)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Format number with thousand separators
 */
export function formatNumber(num: number, locale: string = 'vi-VN'): string {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * Format currency (VND)
 */
export function formatCurrency(amount: number, currency: string = 'VND', locale: string = 'vi-VN'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Mask email (show first 3 chars and domain)
 */
export function maskEmail(email: string): string {
  if (!email) return '';
  
  const [name, domain] = email.split('@');
  if (!domain) return email;
  
  const visibleChars = Math.min(3, name.length);
  const masked = name.substring(0, visibleChars) + '***';
  
  return `${masked}@${domain}`;
}

/**
 * Mask phone number (show last 4 digits)
 */
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 4) return phone;
  
  const lastFour = phone.slice(-4);
  const masked = '*'.repeat(phone.length - 4);
  
  return masked + lastFour;
}

/**
 * Extract initials from name
 */
export function getInitials(name: string, maxChars: number = 2): string {
  if (!name) return '';
  
  const parts = name.trim().split(/\s+/);
  
  if (parts.length === 1) {
    return parts[0].substring(0, maxChars).toUpperCase();
  }
  
  return parts
    .map(part => part.charAt(0))
    .join('')
    .substring(0, maxChars)
    .toUpperCase();
}

/**
 * Generate random string
 */
export function randomString(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

/**
 * Generate UUID v4
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Pluralize word
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) return `${count} ${singular}`;
  return `${count} ${plural || singular + 's'}`;
}

/**
 * Vietnamese pluralize helper
 */
export function pluralizeVi(count: number, word: string): string {
  return `${count} ${word}`;
}

/**
 * Pad number with leading zeros
 */
export function padNumber(num: number, size: number = 2): string {
  return num.toString().padStart(size, '0');
}

/**
 * Convert camelCase to Title Case
 */
export function camelToTitle(str: string): string {
  const result = str.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}

/**
 * Convert snake_case to Title Case
 */
export function snakeToTitle(str: string): string {
  return str
    .split('_')
    .map(word => capitalize(word))
    .join(' ');
}

/**
 * Highlight search term in text
 */
export function highlightText(text: string, searchTerm: string): string {
  if (!searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Strip HTML tags
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Escape HTML
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Parse query string to object
 */
export function parseQueryString(queryString: string): Record<string, string> {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};
  
  params.forEach((value, key) => {
    result[key] = value;
  });
  
  return result;
}

/**
 * Build query string from object
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
}

/**
 * Clean and normalize whitespace
 */
export function normalizeWhitespace(str: string): string {
  return str.replace(/\s+/g, ' ').trim();
}

/**
 * Check if string is empty or whitespace
 */
export function isBlank(str: string | null | undefined): boolean {
  return !str || str.trim().length === 0;
}

/**
 * Reverse string
 */
export function reverseString(str: string): string {
  return str.split('').reverse().join('');
}

/**
 * Count words in text
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Get reading time estimate (words per minute)
 */
export function getReadingTime(text: string, wordsPerMinute: number = 200): number {
  const wordCount = countWords(text);
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Format phone number (Vietnamese)
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    // Format: 0123 456 789
    return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  } else if (cleaned.length === 11 && cleaned.startsWith('84')) {
    // Format: +84 123 456 789
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, '+$1 $2 $3 $4');
  }
  
  return phone;
}

/**
 * Compare versions (semantic versioning)
 */
export function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;
    
    if (part1 > part2) return 1;
    if (part1 < part2) return -1;
  }
  
  return 0;
}

export default {
  capitalize,
  capitalizeWords,
  toTitleCase,
  truncate,
  removeAccents,
  slugify,
  formatFileSize,
  formatNumber,
  formatCurrency,
  formatPercentage,
  maskEmail,
  maskPhone,
  getInitials,
  randomString,
  generateUUID,
  pluralize,
  pluralizeVi,
  padNumber,
  camelToTitle,
  snakeToTitle,
  highlightText,
  stripHtml,
  escapeHtml,
  parseQueryString,
  buildQueryString,
  normalizeWhitespace,
  isBlank,
  reverseString,
  countWords,
  getReadingTime,
  formatPhoneNumber,
  compareVersions,
};
