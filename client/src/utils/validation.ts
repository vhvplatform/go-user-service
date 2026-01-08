/**
 * Form Validation Utilities
 * Provides common validation functions and schemas
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Email validation
 */
export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  return { isValid: true };
}

/**
 * Password validation
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters' };
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }

  if (!/[0-9]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }

  return { isValid: true };
}

/**
 * Username validation
 */
export function validateUsername(username: string): ValidationResult {
  if (!username) {
    return { isValid: false, error: 'Username is required' };
  }

  if (username.length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters' };
  }

  if (username.length > 20) {
    return { isValid: false, error: 'Username must not exceed 20 characters' };
  }

  if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, dots, hyphens, and underscores' };
  }

  return { isValid: true };
}

/**
 * Phone number validation (Vietnamese format)
 */
export function validatePhone(phone: string): ValidationResult {
  if (!phone) {
    return { isValid: false, error: 'Phone number is required' };
  }

  // Remove spaces and special characters
  const cleaned = phone.replace(/[\s\-()]/g, '');

  // Vietnamese phone number formats
  const phoneRegex = /^(\+84|84|0)(3|5|7|8|9)\d{8}$/;
  
  if (!phoneRegex.test(cleaned)) {
    return { isValid: false, error: 'Invalid Vietnamese phone number format' };
  }

  return { isValid: true };
}

/**
 * Required field validation
 */
export function validateRequired(value: any, fieldName: string = 'Field'): ValidationResult {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (typeof value === 'string' && value.trim() === '') {
    return { isValid: false, error: `${fieldName} cannot be empty` };
  }

  return { isValid: true };
}

/**
 * Min length validation
 */
export function validateMinLength(value: string, min: number, fieldName: string = 'Field'): ValidationResult {
  if (value.length < min) {
    return { isValid: false, error: `${fieldName} must be at least ${min} characters` };
  }
  return { isValid: true };
}

/**
 * Max length validation
 */
export function validateMaxLength(value: string, max: number, fieldName: string = 'Field'): ValidationResult {
  if (value.length > max) {
    return { isValid: false, error: `${fieldName} must not exceed ${max} characters` };
  }
  return { isValid: true };
}

/**
 * URL validation
 */
export function validateUrl(url: string): ValidationResult {
  if (!url) {
    return { isValid: false, error: 'URL is required' };
  }

  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Invalid URL format' };
  }
}

/**
 * Number range validation
 */
export function validateNumberRange(
  value: number,
  min: number,
  max: number,
  fieldName: string = 'Value'
): ValidationResult {
  if (value < min || value > max) {
    return { isValid: false, error: `${fieldName} must be between ${min} and ${max}` };
  }
  return { isValid: true };
}

/**
 * Date validation
 */
export function validateDate(date: string | Date): ValidationResult {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: 'Invalid date format' };
  }

  return { isValid: true };
}

/**
 * Future date validation
 */
export function validateFutureDate(date: string | Date): ValidationResult {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: 'Invalid date format' };
  }

  if (dateObj <= new Date()) {
    return { isValid: false, error: 'Date must be in the future' };
  }

  return { isValid: true };
}

/**
 * Past date validation
 */
export function validatePastDate(date: string | Date): ValidationResult {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: 'Invalid date format' };
  }

  if (dateObj >= new Date()) {
    return { isValid: false, error: 'Date must be in the past' };
  }

  return { isValid: true };
}

/**
 * Form validation helper
 * Validates multiple fields at once
 */
export function validateForm<T extends Record<string, any>>(
  data: T,
  rules: {
    [K in keyof T]?: Array<(value: T[K]) => ValidationResult>;
  }
): {
  isValid: boolean;
  errors: Partial<Record<keyof T, string>>;
} {
  const errors: Partial<Record<keyof T, string>> = {};
  let isValid = true;

  for (const field in rules) {
    const validators = rules[field];
    if (!validators) continue;

    for (const validator of validators) {
      const result = validator(data[field]);
      if (!result.isValid) {
        errors[field] = result.error;
        isValid = false;
        break; // Stop at first error for this field
      }
    }
  }

  return { isValid, errors };
}

/**
 * Common validation rules
 */
export const ValidationRules = {
  email: (value: string) => validateEmail(value),
  password: (value: string) => validatePassword(value),
  username: (value: string) => validateUsername(value),
  phone: (value: string) => validatePhone(value),
  required: (fieldName: string) => (value: any) => validateRequired(value, fieldName),
  minLength: (min: number, fieldName: string) => (value: string) => 
    validateMinLength(value, min, fieldName),
  maxLength: (max: number, fieldName: string) => (value: string) => 
    validateMaxLength(value, max, fieldName),
  url: (value: string) => validateUrl(value),
  numberRange: (min: number, max: number, fieldName: string) => (value: number) => 
    validateNumberRange(value, min, max, fieldName),
  date: (value: string | Date) => validateDate(value),
  futureDate: (value: string | Date) => validateFutureDate(value),
  pastDate: (value: string | Date) => validatePastDate(value),
};

export default {
  validateEmail,
  validatePassword,
  validateUsername,
  validatePhone,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateUrl,
  validateNumberRange,
  validateDate,
  validateFutureDate,
  validatePastDate,
  validateForm,
  ValidationRules,
};
