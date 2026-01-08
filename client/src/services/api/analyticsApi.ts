/**
 * Analytics API Service
 * Dashboard and analytics endpoints
 */

import apiClient, { isMockMode } from './apiClient';
import { ApiResponse, AnalyticsData } from '../types/api.types';
import { mockAnalyticsData } from '../mockData/analytics.mock';

const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

class AnalyticsApi {
  /**
   * Get dashboard analytics data
   */
  async getDashboardData(timeRange: string = '7d'): Promise<ApiResponse<AnalyticsData>> {
    if (isMockMode()) {
      await mockDelay();
      
      // Could modify data based on timeRange in real implementation
      return {
        success: true,
        message: 'Analytics data retrieved successfully',
        data: mockAnalyticsData,
      };
    }
    
    const response = await apiClient.get<ApiResponse<AnalyticsData>>('/analytics/dashboard', {
      params: { timeRange },
    });
    return response.data;
  }

  /**
   * Get user growth trends
   */
  async getUserGrowth(period: string = 'monthly'): Promise<ApiResponse<any>> {
    if (isMockMode()) {
      await mockDelay();
      
      return {
        success: true,
        message: 'User growth data retrieved successfully',
        data: mockAnalyticsData.userGrowth,
      };
    }
    
    const response = await apiClient.get<ApiResponse<any>>('/analytics/user-growth', {
      params: { period },
    });
    return response.data;
  }

  /**
   * Get activity metrics
   */
  async getActivityMetrics(timeRange: string = '7d'): Promise<ApiResponse<any>> {
    if (isMockMode()) {
      await mockDelay();
      
      return {
        success: true,
        message: 'Activity metrics retrieved successfully',
        data: mockAnalyticsData.activityData,
      };
    }
    
    const response = await apiClient.get<ApiResponse<any>>('/analytics/activity', {
      params: { timeRange },
    });
    return response.data;
  }

  /**
   * Get security metrics
   */
  async getSecurityMetrics(timeRange: string = '30d'): Promise<ApiResponse<any>> {
    if (isMockMode()) {
      await mockDelay();
      
      return {
        success: true,
        message: 'Security metrics retrieved successfully',
        data: mockAnalyticsData.securityData,
      };
    }
    
    const response = await apiClient.get<ApiResponse<any>>('/analytics/security', {
      params: { timeRange },
    });
    return response.data;
  }

  /**
   * Get role distribution
   */
  async getRoleDistribution(): Promise<ApiResponse<any>> {
    if (isMockMode()) {
      await mockDelay();
      
      return {
        success: true,
        message: 'Role distribution retrieved successfully',
        data: mockAnalyticsData.roleDistribution,
      };
    }
    
    const response = await apiClient.get<ApiResponse<any>>('/analytics/roles');
    return response.data;
  }

  /**
   * Get status distribution
   */
  async getStatusDistribution(): Promise<ApiResponse<any>> {
    if (isMockMode()) {
      await mockDelay();
      
      return {
        success: true,
        message: 'Status distribution retrieved successfully',
        data: mockAnalyticsData.statusDistribution,
      };
    }
    
    const response = await apiClient.get<ApiResponse<any>>('/analytics/status');
    return response.data;
  }

  /**
   * Export analytics report
   */
  async exportReport(format: 'pdf' | 'excel' | 'csv' = 'pdf'): Promise<Blob> {
    if (isMockMode()) {
      await mockDelay();
      
      // Mock report content
      const reportContent = `Analytics Report\n\nGenerated: ${new Date().toISOString()}\n\nTotal Users: ${mockAnalyticsData.stats.totalUsers}\nActive Users: ${mockAnalyticsData.stats.activeUsers}\n`;
      
      return new Blob([reportContent], { type: 'text/plain' });
    }
    
    const response = await apiClient.get('/analytics/export', {
      params: { format },
      responseType: 'blob',
    });
    
    return response.data;
  }
}

export default new AnalyticsApi();
