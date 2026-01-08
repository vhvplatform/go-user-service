/**
 * Vite Environment Configuration Helper
 * Provides type-safe access to environment variables
 */

/**
 * Get environment variable value (client-side safe)
 * In Vite, only VITE_* variables are available on client-side
 */
function getEnvVar(key: string, defaultValue?: string): string {
  // For Vite, all client-side env vars must be prefixed with VITE_
  const value = import.meta.env[key] || defaultValue;
  
  if (value === undefined) {
    if (!key.startsWith('VITE_')) {
      console.warn(
        `[Vite Env] ⚠️ Accessing non-VITE_ variable "${key}". This will be undefined.`
      );
    }
    return '';
  }
  
  return value;
}

/**
 * Get boolean environment variable
 */
function getEnvBoolean(key: string, defaultValue: boolean = false): boolean {
  const value = getEnvVar(key);
  
  if (value === '') return defaultValue;
  
  return value === 'true' || value === '1';
}

/**
 * Get number environment variable
 */
function getEnvNumber(key: string, defaultValue: number = 0): number {
  const value = getEnvVar(key);
  
  if (value === '') return defaultValue;
  
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Check if we're in development mode
 */
export function isDevelopment(): boolean {
  return import.meta.env.DEV;
}

/**
 * Check if we're in production mode
 */
export function isProduction(): boolean {
  return import.meta.env.PROD;
}

/**
 * Check if we're in test mode
 */
export function isTest(): boolean {
  return import.meta.env.MODE === 'test';
}

/**
 * Environment Configuration Interface
 */
export interface EnvConfig {
  // Tenant Configuration
  tenantId: string;
  tenantName: string;

  // API Configuration
  apiBaseUrl: string;
  apiTimeout: number;
  userServiceUrl: string;
  authServiceUrl: string;
  fileServiceUrl: string;

  // Supabase Configuration
  supabaseUrl: string;
  supabaseAnonKey: string;

  // Application Configuration
  appName: string;
  appVersion: string;
  appEnv: 'development' | 'staging' | 'production';

  // Feature Flags
  features: {
    analytics: boolean;
    notifications: boolean;
    reports: boolean;
    teams: boolean;
  };

  // Pagination
  pagination: {
    defaultPageSize: number;
    maxPageSize: number;
  };

  // Cache Configuration
  cache: {
    ttl: number;
    enabled: boolean;
  };

  // Debug Configuration
  debug: {
    enabled: boolean;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
  };

  // Security Configuration
  forceHttps: boolean;
  sessionTimeout: number;
  enableRequestSigning: boolean;
  corsAllowedOrigins: string[];
  enableErrorReporting: boolean;
  errorReportingUrl: string;
  rateLimitMaxRequests: number;
  rateLimitWindowMs: number;
  cspEnabled: boolean;
}

/**
 * Export environment configuration
 */
export const env: EnvConfig = {
  // Tenant Configuration
  tenantId: getEnvVar('VITE_TENANT_ID', 'tenant-123'),
  tenantName: getEnvVar('VITE_TENANT_NAME', 'VHV Platform'),

  // API Configuration
  apiBaseUrl: getEnvVar('VITE_API_BASE_URL', 'https://api.vhvplatform.com'),
  apiTimeout: getEnvNumber('VITE_API_TIMEOUT', 30000),
  userServiceUrl: getEnvVar('VITE_USER_SERVICE_URL', 'https://api.vhvplatform.com/user-service'),
  authServiceUrl: getEnvVar('VITE_AUTH_SERVICE_URL', 'https://api.vhvplatform.com/auth-service'),
  fileServiceUrl: getEnvVar('VITE_FILE_SERVICE_URL', 'https://api.vhvplatform.com/file-service'),

  // Supabase Configuration
  supabaseUrl: getEnvVar('VITE_SUPABASE_URL', ''),
  supabaseAnonKey: getEnvVar('VITE_SUPABASE_ANON_KEY', ''),

  // Application Configuration
  appName: getEnvVar('VITE_APP_NAME', 'VHV Platform'),
  appVersion: getEnvVar('VITE_APP_VERSION', '3.2.0'),
  appEnv: (getEnvVar('VITE_APP_ENV', 'development') as EnvConfig['appEnv']),

  // Feature Flags
  features: {
    analytics: getEnvBoolean('VITE_FEATURE_ANALYTICS', true),
    notifications: getEnvBoolean('VITE_FEATURE_NOTIFICATIONS', true),
    reports: getEnvBoolean('VITE_FEATURE_REPORTS', true),
    teams: getEnvBoolean('VITE_FEATURE_TEAMS', true),
  },

  // Pagination
  pagination: {
    defaultPageSize: getEnvNumber('VITE_DEFAULT_PAGE_SIZE', 10),
    maxPageSize: getEnvNumber('VITE_MAX_PAGE_SIZE', 100),
  },

  // Cache Configuration
  cache: {
    ttl: getEnvNumber('VITE_CACHE_TTL', 300000), // 5 minutes
    enabled: getEnvBoolean('VITE_ENABLE_CACHE', true),
  },

  // Debug Configuration
  debug: {
    enabled: getEnvBoolean('VITE_DEBUG_MODE', false),
    logLevel: (getEnvVar('VITE_LOG_LEVEL', 'info') as EnvConfig['debug']['logLevel']),
  },

  // Security Configuration
  forceHttps: getEnvBoolean('VITE_FORCE_HTTPS', true),
  sessionTimeout: getEnvNumber('VITE_SESSION_TIMEOUT', 3600), // 1 hour
  enableRequestSigning: getEnvBoolean('VITE_ENABLE_REQUEST_SIGNING', true),
  corsAllowedOrigins: getEnvVar('VITE_CORS_ALLOWED_ORIGINS', 'https://example.com').split(','),
  enableErrorReporting: getEnvBoolean('VITE_ENABLE_ERROR_REPORTING', true),
  errorReportingUrl: getEnvVar('VITE_ERROR_REPORTING_URL', 'https://error-reporting-url.com'),
  rateLimitMaxRequests: getEnvNumber('VITE_RATE_LIMIT_MAX_REQUESTS', 100),
  rateLimitWindowMs: getEnvNumber('VITE_RATE_LIMIT_WINDOW_MS', 60000), // 1 minute
  cspEnabled: getEnvBoolean('VITE_CSP_ENABLED', true),
};

/**
 * Validate required environment variables
 */
export function validateEnv(): void {
  const requiredVars = [
    'VITE_TENANT_ID',
    'VITE_API_BASE_URL',
  ];

  const missing: string[] = [];

  requiredVars.forEach(varName => {
    if (!import.meta.env[varName]) {
      missing.push(varName);
    }
  });

  if (missing.length > 0) {
    console.error(
      `[Vite Env] ❌ Missing required environment variables:\n${missing.join('\n')}\n\n` +
      `Please check your .env file.`
    );
  }
}

// Log environment configuration in development
if (isDevelopment()) {
  console.group('🔧 Vite Environment Configuration');
  console.log('Mode:', import.meta.env.MODE);
  console.log('Environment:', env.appEnv);
  console.log('App Name:', env.appName);
  console.log('App Version:', env.appVersion);
  console.log('API Base URL:', env.apiBaseUrl);
  console.log('Mock Mode:', env.debug.enabled ? '✅ Enabled' : '❌ Disabled');
  console.log('Debug Mode:', env.debug.enabled);
  console.groupEnd();
  
  // Validate on startup
  validateEnv();
}