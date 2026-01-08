/**
 * Date and Time Utilities
 * Helper functions for date formatting and manipulation
 */

/**
 * Format date to Vietnamese locale
 */
export function formatDate(date: string | Date, format: 'short' | 'long' | 'full' = 'short'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }

  const options: Intl.DateTimeFormatOptions = {
    short: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
    full: {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  }[format];

  return dateObj.toLocaleDateString('vi-VN', options);
}

/**
 * Format time
 */
export function formatTime(date: string | Date, includeSeconds: boolean = false): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return 'Invalid time';
  }

  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...(includeSeconds && { second: '2-digit' }),
  };

  return dateObj.toLocaleTimeString('vi-VN', options);
}

/**
 * Format date and time
 */
export function formatDateTime(date: string | Date, includeSeconds: boolean = false): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    ...(includeSeconds && { second: '2-digit' }),
  };

  return dateObj.toLocaleString('vi-VN', options);
}

/**
 * Get relative time (e.g., "2 hours ago", "in 3 days")
 */
export function getRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  const rtf = new Intl.RelativeTimeFormat('vi-VN', { numeric: 'auto' });

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const diff = Math.floor(diffInSeconds / secondsInUnit);
    
    if (Math.abs(diff) >= 1) {
      return rtf.format(-diff, unit as Intl.RelativeTimeFormatUnit);
    }
  }

  return 'vừa xong';
}

/**
 * Format relative time (alias for getRelativeTime for better naming)
 */
export function formatRelativeTime(date: string | Date): string {
  return getRelativeTime(date);
}

/**
 * Check if date is today
 */
export function isToday(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();

  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if date is yesterday
 */
export function isYesterday(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return (
    dateObj.getDate() === yesterday.getDate() &&
    dateObj.getMonth() === yesterday.getMonth() &&
    dateObj.getFullYear() === yesterday.getFullYear()
  );
}

/**
 * Check if date is this week
 */
export function isThisWeek(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
  const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6));

  return dateObj >= weekStart && dateObj <= weekEnd;
}

/**
 * Get start of day
 */
export function getStartOfDay(date: Date = new Date()): Date {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
}

/**
 * Get end of day
 */
export function getEndOfDay(date: Date = new Date()): Date {
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay;
}

/**
 * Get start of week
 */
export function getStartOfWeek(date: Date = new Date()): Date {
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day;
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
}

/**
 * Get end of week
 */
export function getEndOfWeek(date: Date = new Date()): Date {
  const endOfWeek = new Date(date);
  const day = endOfWeek.getDay();
  const diff = endOfWeek.getDate() + (6 - day);
  endOfWeek.setDate(diff);
  endOfWeek.setHours(23, 59, 59, 999);
  return endOfWeek;
}

/**
 * Get start of month
 */
export function getStartOfMonth(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

/**
 * Get end of month
 */
export function getEndOfMonth(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

/**
 * Add days to date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Add months to date
 */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * Add years to date
 */
export function addYears(date: Date, years: number): Date {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

/**
 * Get difference in days
 */
export function getDifferenceInDays(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get difference in hours
 */
export function getDifferenceInHours(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60));
}

/**
 * Get difference in minutes
 */
export function getDifferenceInMinutes(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(diffTime / (1000 * 60));
}

/**
 * Format duration (e.g., "2h 30m", "45s")
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${minutes}m ${secs}s` : `${minutes}m`;
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}

/**
 * Parse ISO date string
 */
export function parseISODate(dateString: string): Date | null {
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

/**
 * Format to ISO string
 */
export function toISOString(date: Date): string {
  return date.toISOString();
}

/**
 * Get age from birth date
 */
export function getAge(birthDate: string | Date): number {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Get date range for common periods
 */
export function getDateRange(period: 'today' | 'yesterday' | 'week' | 'month' | 'year'): {
  start: Date;
  end: Date;
} {
  const now = new Date();
  
  switch (period) {
    case 'today':
      return {
        start: getStartOfDay(now),
        end: getEndOfDay(now),
      };
    
    case 'yesterday':
      const yesterday = addDays(now, -1);
      return {
        start: getStartOfDay(yesterday),
        end: getEndOfDay(yesterday),
      };
    
    case 'week':
      return {
        start: getStartOfWeek(now),
        end: getEndOfWeek(now),
      };
    
    case 'month':
      return {
        start: getStartOfMonth(now),
        end: getEndOfMonth(now),
      };
    
    case 'year':
      return {
        start: new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0),
        end: new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999),
      };
  }
}

export default {
  formatDate,
  formatTime,
  formatDateTime,
  getRelativeTime,
  formatRelativeTime,
  isToday,
  isYesterday,
  isThisWeek,
  getStartOfDay,
  getEndOfDay,
  getStartOfWeek,
  getEndOfWeek,
  getStartOfMonth,
  getEndOfMonth,
  addDays,
  addMonths,
  addYears,
  getDifferenceInDays,
  getDifferenceInHours,
  getDifferenceInMinutes,
  formatDuration,
  parseISODate,
  toISOString,
  getAge,
  getDateRange,
};