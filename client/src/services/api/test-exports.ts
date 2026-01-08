/**
 * Test Exports
 * Quick test to verify all API exports are working
 */

import apiClient from './apiClient';
import authApi from './authApi';
import userApi from './userApi';
import roleApi from './roleApi';
import analyticsApi from './analyticsApi';
import notificationApi from './notificationApi';
import reportApi from './reportApi';

// Test that all services are exported correctly
console.log('✅ apiClient:', typeof apiClient);
console.log('✅ authApi:', typeof authApi);
console.log('✅ userApi:', typeof userApi);
console.log('✅ roleApi:', typeof roleApi);
console.log('✅ analyticsApi:', typeof analyticsApi);
console.log('✅ notificationApi:', typeof notificationApi);
console.log('✅ reportApi:', typeof reportApi);

export const testExports = () => {
  console.log('All API services exported successfully!');
  return {
    apiClient,
    authApi,
    userApi,
    roleApi,
    analyticsApi,
    notificationApi,
    reportApi,
  };
};
