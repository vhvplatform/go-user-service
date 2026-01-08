/**
 * Environment Variable Migration Helper
 * Helper functions to migrate from:
 * - VITE_* → VITE_* (already using Vite)
 * - import.meta.env.DEV → import.meta.env.DEV (standard)
 * - import.meta.env.PROD → import.meta.env.PROD (standard)
 */

/**
 * Get environment variable (Next.js compatible)
 */
export const getEnv = (key: string, defaultValue: string = ''): string => {
  return process.env[key] || defaultValue;
};

/**
 * Check if we're in development mode
 */
export const isDev = (): boolean => {
  return import.meta.env.DEV;
};

/**
 * Check if we're in production mode
 */
export const isProd = (): boolean => {
  return import.meta.env.PROD;
};

/**
 * Migration mapping for common variables
 */
export const ENV_MIGRATION_MAP = {
  // Environment
  'VITE_ENVIRONMENT': 'NEXT_PUBLIC_ENVIRONMENT',
  
  // API URLs
  'VITE_API_URL_LOCAL': 'NEXT_PUBLIC_API_URL_LOCAL',
  'VITE_API_URL_DEV': 'NEXT_PUBLIC_API_URL_DEV',
  'VITE_API_URL_STAGING': 'NEXT_PUBLIC_API_URL_STAGING',
  'VITE_API_URL_PRODUCTION': 'NEXT_PUBLIC_API_URL_PRODUCTION',
  'VITE_API_BASE_URL': 'NEXT_PUBLIC_API_BASE_URL',
  
  // Mock API
  'VITE_USE_MOCK_API': 'NEXT_PUBLIC_USE_MOCK_API',
  'VITE_USE_MOCK_DATA': 'NEXT_PUBLIC_USE_MOCK_DATA',
  
  // Services
  'VITE_USER_SERVICE_URL': 'NEXT_PUBLIC_USER_SERVICE_URL',
  'VITE_AUTH_SERVICE_URL': 'NEXT_PUBLIC_AUTH_SERVICE_URL',
  'VITE_FILE_SERVICE_URL': 'NEXT_PUBLIC_FILE_SERVICE_URL',
  'VITE_GO_USER_SERVICE_URL': 'NEXT_PUBLIC_GO_USER_SERVICE_URL',
  
  // App Config
  'VITE_APP_NAME': 'NEXT_PUBLIC_APP_NAME',
  'VITE_APP_VERSION': 'NEXT_PUBLIC_APP_VERSION',
  'VITE_APP_ENV': 'NEXT_PUBLIC_APP_ENV',
  
  // Supabase
  'VITE_SUPABASE_URL': 'NEXT_PUBLIC_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY': 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  
  // Features
  'VITE_FEATURE_ANALYTICS': 'NEXT_PUBLIC_FEATURE_ANALYTICS',
  'VITE_FEATURE_NOTIFICATIONS': 'NEXT_PUBLIC_FEATURE_NOTIFICATIONS',
  'VITE_FEATURE_REPORTS': 'NEXT_PUBLIC_FEATURE_REPORTS',
  'VITE_FEATURE_TEAMS': 'NEXT_PUBLIC_FEATURE_TEAMS',
  
  // Pagination
  'VITE_DEFAULT_PAGE_SIZE': 'NEXT_PUBLIC_DEFAULT_PAGE_SIZE',
  'VITE_MAX_PAGE_SIZE': 'NEXT_PUBLIC_MAX_PAGE_SIZE',
  
  // Cache
  'VITE_CACHE_TTL': 'NEXT_PUBLIC_CACHE_TTL',
  'VITE_ENABLE_CACHE': 'NEXT_PUBLIC_ENABLE_CACHE',
  
  // Debug
  'VITE_DEBUG_MODE': 'NEXT_PUBLIC_DEBUG_MODE',
  'VITE_LOG_LEVEL': 'NEXT_PUBLIC_LOG_LEVEL',
  'VITE_ENABLE_DEBUG': 'NEXT_PUBLIC_ENABLE_DEBUG',
  
  // Security
  'VITE_FORCE_HTTPS': 'NEXT_PUBLIC_FORCE_HTTPS',
  'VITE_SESSION_TIMEOUT': 'NEXT_PUBLIC_SESSION_TIMEOUT',
  'VITE_ENABLE_REQUEST_SIGNING': 'NEXT_PUBLIC_ENABLE_REQUEST_SIGNING',
  'VITE_CORS_ALLOWED_ORIGINS': 'NEXT_PUBLIC_CORS_ALLOWED_ORIGINS',
  'VITE_ENABLE_ERROR_REPORTING': 'NEXT_PUBLIC_ENABLE_ERROR_REPORTING',
  'VITE_ERROR_REPORTING_URL': 'NEXT_PUBLIC_ERROR_REPORTING_URL',
  'VITE_RATE_LIMIT_MAX_REQUESTS': 'NEXT_PUBLIC_RATE_LIMIT_MAX_REQUESTS',
  'VITE_RATE_LIMIT_WINDOW_MS': 'NEXT_PUBLIC_RATE_LIMIT_WINDOW_MS',
  'VITE_CSP_ENABLED': 'NEXT_PUBLIC_CSP_ENABLED',
  
  // Tenant
  'VITE_TENANT_ID': 'NEXT_PUBLIC_TENANT_ID',
  'VITE_TENANT_NAME': 'NEXT_PUBLIC_TENANT_NAME',
  'VITE_API_TIMEOUT': 'NEXT_PUBLIC_API_TIMEOUT',
} as const;

/**
 * Log migration helper loaded
 */
if (import.meta.env.DEV) {
  console.log('📦 Environment Migration Helper loaded (Vite native)');
}

export default {
  getEnv,
  isDev,
  isProd,
  ENV_MIGRATION_MAP,
};