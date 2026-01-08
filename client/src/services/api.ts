/**
 * API Services - Central Export
 * Re-exports all API services and types
 */

// Re-export everything from the new API structure
export * from './api/index';

// Export legacy statsApi for backward compatibility
import { mockStats, mockGrowthData, mockActivities } from './mockData';

const simulateDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Legacy types (kept for backward compatibility)
export interface LegacyApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LegacyPaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Legacy statsApi (kept for backward compatibility)
export const statsApi = {
  getStats: async () => {
    await simulateDelay(200);
    return mockStats;
  },
  getGrowthData: async () => {
    await simulateDelay(200);
    return mockGrowthData;
  },
  getActivities: async () => {
    await simulateDelay(200);
    return mockActivities;
  },
};
