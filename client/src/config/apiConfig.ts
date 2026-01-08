/**
 * API Configuration for microservices
 * Centralized API endpoints and environment management
 * Updated for Vite environment variables
 */

export type Environment = 'local' | 'dev' | 'dev-shared' | 'staging' | 'production';

export interface ApiConfig {
  // Environment
  environment: Environment;

  // Use mock data or real API
  useMockData: boolean;

  // API Base URLs for each environment
  apiBaseUrls: {
    local: string;
    dev: string;
    'dev-shared': string;
    staging: string;
    production: string;
  };

  // Microservices endpoints
  services: {
    auth: string;
    user: string;
    role: string;
    analytics: string;
    notification: string;
    report: string;
  };

  // Request timeout (ms)
  timeout: number;

  // Retry configuration
  retry: {
    enabled: boolean;
    maxRetries: number;
    retryDelay: number; // ms
  };
}

// Get environment from env variable or default to 'dev'
const getEnvironment = (): Environment => {
  const env = import.meta.env.VITE_ENVIRONMENT as Environment;
  return env || 'dev';
};

// Get use mock data setting
const getUseMockData = (): boolean => {
  const useMock = import.meta.env.VITE_USE_MOCK_DATA;
  // Change default to false for integration testing
  if (useMock === undefined) return false;
  return useMock === 'true';
};

// API Configuration
export const apiConfig: ApiConfig = {
  environment: 'local', // Point to localhost:8080 (Gateway)
  useMockData: getUseMockData(),

  apiBaseUrls: {
    local: 'http://localhost:8080',
    dev: 'https://api-dev.vhvplatform.com',
    'dev-shared': 'https://api-dev-shared.vhvplatform.com',
    staging: 'https://api-staging.vhvplatform.com',
    production: 'https://api.vhvplatform.com',
  },

  services: {
    auth: '/api/v1/auth',
    user: '/api/v1/users',
    role: '/api/v1/roles',
    analytics: '/api/v1/analytics',
    notification: '/api/v1/notifications',
    report: '/api/v1/reports',
  },

  timeout: 30000, // 30 seconds

  retry: {
    enabled: true,
    maxRetries: 3,
    retryDelay: 1000, // 1 second
  },
};

// Helper function to get full API URL
export const getApiUrl = (service: keyof typeof apiConfig.services, path: string = ''): string => {
  const baseUrl = apiConfig.apiBaseUrls[apiConfig.environment];
  const servicePath = apiConfig.services[service];
  return `${baseUrl}${servicePath}${path}`;
};

// Helper function to check if using mock data
export const isUsingMockData = (): boolean => {
  return apiConfig.useMockData;
};

// Helper function to get current environment
export const getCurrentEnvironment = (): Environment => {
  return apiConfig.environment;
};

// Helper function to get environment badge color
export const getEnvironmentColor = (env?: Environment): string => {
  const currentEnv = env || apiConfig.environment;

  switch (currentEnv) {
    case 'local':
      return 'bg-gray-500';
    case 'dev':
      return 'bg-blue-500';
    case 'dev-shared':
      return 'bg-blue-500';
    case 'staging':
      return 'bg-yellow-500';
    case 'production':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

// Helper function to get environment label
export const getEnvironmentLabel = (env?: Environment): string => {
  const currentEnv = env || apiConfig.environment;

  switch (currentEnv) {
    case 'local':
      return 'Local';
    case 'dev':
      return 'Development';
    case 'dev-shared':
      return 'Development Shared';
    case 'staging':
      return 'Staging';
    case 'production':
      return 'Production';
    default:
      return 'Unknown';
  }
};

export default apiConfig;