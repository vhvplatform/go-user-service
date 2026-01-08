/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Environment
  readonly VITE_ENVIRONMENT: 'local' | 'dev' | 'dev-shared' | 'staging' | 'production';
  
  // API URLs
  readonly VITE_API_URL_LOCAL: string;
  readonly VITE_API_URL_DEV: string;
  readonly VITE_API_URL_STAGING: string;
  readonly VITE_API_URL_PRODUCTION: string;
  
  // API Configuration
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_USE_MOCK_API: string;
  readonly VITE_USE_MOCK_DATA: string;
  
  // Microservices
  readonly VITE_USER_SERVICE_URL: string;
  readonly VITE_AUTH_SERVICE_URL: string;
  readonly VITE_FILE_SERVICE_URL: string;
  readonly VITE_GO_USER_SERVICE_URL: string;
  
  // Supabase
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  
  // Application
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_ENV: string;
  readonly VITE_TENANT_ID: string;
  readonly VITE_TENANT_NAME: string;
  
  // Feature Flags
  readonly VITE_FEATURE_ANALYTICS: string;
  readonly VITE_FEATURE_NOTIFICATIONS: string;
  readonly VITE_FEATURE_REPORTS: string;
  readonly VITE_FEATURE_TEAMS: string;
  
  // Pagination
  readonly VITE_DEFAULT_PAGE_SIZE: string;
  readonly VITE_MAX_PAGE_SIZE: string;
  
  // Cache
  readonly VITE_CACHE_TTL: string;
  readonly VITE_ENABLE_CACHE: string;
  
  // Debug
  readonly VITE_DEBUG_MODE: string;
  readonly VITE_LOG_LEVEL: string;
  readonly VITE_ENABLE_DEBUG: string;
  
  // Security
  readonly VITE_FORCE_HTTPS: string;
  readonly VITE_SESSION_TIMEOUT: string;
  readonly VITE_ENABLE_REQUEST_SIGNING: string;
  readonly VITE_CORS_ALLOWED_ORIGINS: string;
  readonly VITE_ENABLE_ERROR_REPORTING: string;
  readonly VITE_ERROR_REPORTING_URL: string;
  readonly VITE_RATE_LIMIT_MAX_REQUESTS: string;
  readonly VITE_RATE_LIMIT_WINDOW_MS: string;
  readonly VITE_CSP_ENABLED: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
