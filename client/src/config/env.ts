/**
 * Load and validate environment configuration (Vite)
 * Re-export from viteEnv for backwards compatibility
 */

export {
  env,
  type EnvConfig,
  validateEnv,
  isDevelopment,
  isProduction,
  isTest,
} from './viteEnv';

/**
 * Log environment configuration (for debugging)
 */
export function logEnvConfig(): void {
  if (import.meta.env.DEV) {
    // Dynamic import để không block
    import('./viteEnv').then(({ env }) => {
      console.group('🔧 Environment Configuration');
      console.log('Environment:', env.appEnv);
      console.log('Tenant ID:', env.tenantId);
      console.log('API Base URL:', env.apiBaseUrl);
      console.log('User Service URL:', env.userServiceUrl);
      console.log('Features:', env.features);
      console.groupEnd();
    });
  }
}
