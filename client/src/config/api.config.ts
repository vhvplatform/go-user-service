/**
 * API Configuration for Microservices
 * Maps service endpoints for different environments
 */

export type Environment = 'local' | 'dev' | 'staging' | 'production';

export interface ServiceEndpoints {
  baseUrl: string;
  userServiceUrl: string;
  authServiceUrl: string;
  fileManagerUrl: string;
  crmServiceUrl: string;
  hrmServiceUrl: string;
  lmsServiceUrl: string;
}

/**
 * Environment-specific configuration
 * Maps each environment to its service endpoints
 */
export const environmentConfig: Record<Environment, ServiceEndpoints> = {
  local: {
    // Local development - all services on localhost
    baseUrl: 'http://localhost:8080',
    userServiceUrl: 'http://localhost:8081/api/v1/users',
    authServiceUrl: 'http://localhost:8082/api/v1/auth',
    fileManagerUrl: 'http://localhost:8083/api/v1/files',
    crmServiceUrl: 'http://localhost:8084/api/v1/crm',
    hrmServiceUrl: 'http://localhost:8085/api/v1/hrm',
    lmsServiceUrl: 'http://localhost:8086/api/v1/lms',
  },
  
  dev: {
    // Dev shared environment - integrated development environment
    baseUrl: '/api',
    userServiceUrl: '/api/users',
    authServiceUrl: '/api/auth',
    fileManagerUrl: '/api/files',
    crmServiceUrl: '/api/crm',
    hrmServiceUrl: '/api/hrm',
    lmsServiceUrl: '/api/lms',
  },
  
  staging: {
    // Staging - pre-production testing
    baseUrl: 'https://staging-api.vhvplatform.com',
    userServiceUrl: 'https://staging-api.vhvplatform.com/api/v1/users',
    authServiceUrl: 'https://staging-api.vhvplatform.com/api/v1/auth',
    fileManagerUrl: 'https://staging-api.vhvplatform.com/api/v1/files',
    crmServiceUrl: 'https://staging-api.vhvplatform.com/api/v1/crm',
    hrmServiceUrl: 'https://staging-api.vhvplatform.com/api/v1/hrm',
    lmsServiceUrl: 'https://staging-api.vhvplatform.com/api/v1/lms',
  },
  
  production: {
    // Production - live environment
    baseUrl: 'https://api.vhvplatform.com',
    userServiceUrl: 'https://api.vhvplatform.com/api/v1/users',
    authServiceUrl: 'https://api.vhvplatform.com/api/v1/auth',
    fileManagerUrl: 'https://api.vhvplatform.com/api/v1/files',
    crmServiceUrl: 'https://api.vhvplatform.com/api/v1/crm',
    hrmServiceUrl: 'https://api.vhvplatform.com/api/v1/hrm',
    lmsServiceUrl: 'https://api.vhvplatform.com/api/v1/lms',
  },
};