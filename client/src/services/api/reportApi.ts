/**
 * Report API Service
 * Report generation and management endpoints
 */

import apiClient, { isMockMode } from './apiClient';
import {
  ApiResponse,
  PaginatedResponse,
  Report,
  CreateReportRequest,
} from '../types/api.types';
import { mockReports } from '../mockData/analytics.mock';

const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

let mockReportData = [...mockReports];

class ReportApi {
  /**
   * Get all reports with pagination
   */
  async getReports(
    page: number = 1,
    limit: number = 10,
    type?: string,
    status?: string
  ): Promise<PaginatedResponse<Report>> {
    if (isMockMode()) {
      await mockDelay();
      
      let filteredReports = [...mockReportData];
      
      if (type && type !== 'all') {
        filteredReports = filteredReports.filter(r => r.type === type);
      }
      
      if (status) {
        filteredReports = filteredReports.filter(r => r.status === status);
      }
      
      const total = filteredReports.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const items = filteredReports.slice(startIndex, endIndex);
      
      return {
        success: true,
        message: 'Reports retrieved successfully',
        data: {
          items,
          page,
          limit,
          total,
          totalPages,
        },
      };
    }
    
    const response = await apiClient.get<PaginatedResponse<Report>>('/reports', {
      params: { page, limit, type, status },
    });
    return response.data;
  }

  /**
   * Get report by ID
   */
  async getReportById(id: string): Promise<ApiResponse<Report>> {
    if (isMockMode()) {
      await mockDelay(300);
      
      const report = mockReportData.find(r => r.id === id);
      
      if (!report) {
        throw {
          success: false,
          message: 'Report not found',
          error: `Report with ID ${id} does not exist`,
        };
      }
      
      // Increment views
      report.views += 1;
      
      return {
        success: true,
        message: 'Report retrieved successfully',
        data: report,
      };
    }
    
    const response = await apiClient.get<ApiResponse<Report>>(`/reports/${id}`);
    return response.data;
  }

  /**
   * Create new report
   */
  async createReport(data: CreateReportRequest): Promise<ApiResponse<Report>> {
    if (isMockMode()) {
      await mockDelay(1000); // Simulate generation time
      
      const newReport: Report = {
        id: String(mockReportData.length + 1),
        title: data.title,
        description: data.description,
        type: data.type,
        period: data.period,
        generatedDate: new Date().toISOString().split('T')[0],
        status: 'generating',
        size: '-',
        views: 0,
        downloads: 0,
        author: 'Current User',
        tags: data.tags || [],
        favorite: false,
      };
      
      mockReportData.unshift(newReport);
      
      // Simulate async generation
      setTimeout(() => {
        const report = mockReportData.find(r => r.id === newReport.id);
        if (report) {
          report.status = 'ready';
          report.size = `${(Math.random() * 5 + 1).toFixed(1)} MB`;
        }
      }, 3000);
      
      return {
        success: true,
        message: 'Report generation started',
        data: newReport,
      };
    }
    
    const response = await apiClient.post<ApiResponse<Report>>('/reports', data);
    return response.data;
  }

  /**
   * Download report
   */
  async downloadReport(id: string): Promise<Blob> {
    if (isMockMode()) {
      await mockDelay();
      
      const report = mockReportData.find(r => r.id === id);
      
      if (!report) {
        throw new Error('Report not found');
      }
      
      // Increment downloads
      report.downloads += 1;
      
      // Mock report content
      const content = `Report: ${report.title}\n\nGenerated: ${report.generatedDate}\nType: ${report.type}\nPeriod: ${report.period}\n\n[Report content would be here]`;
      
      return new Blob([content], { type: 'application/pdf' });
    }
    
    const response = await apiClient.get(`/reports/${id}/download`, {
      responseType: 'blob',
    });
    
    return response.data;
  }

  /**
   * Toggle favorite status
   */
  async toggleFavorite(id: string): Promise<ApiResponse<Report>> {
    if (isMockMode()) {
      await mockDelay(200);
      
      const report = mockReportData.find(r => r.id === id);
      
      if (!report) {
        throw {
          success: false,
          message: 'Report not found',
          error: `Report with ID ${id} does not exist`,
        };
      }
      
      report.favorite = !report.favorite;
      
      return {
        success: true,
        message: report.favorite ? 'Report added to favorites' : 'Report removed from favorites',
        data: report,
      };
    }
    
    const response = await apiClient.post<ApiResponse<Report>>(`/reports/${id}/favorite`);
    return response.data;
  }

  /**
   * Delete report
   */
  async deleteReport(id: string): Promise<ApiResponse> {
    if (isMockMode()) {
      await mockDelay();
      
      const index = mockReportData.findIndex(r => r.id === id);
      
      if (index === -1) {
        throw {
          success: false,
          message: 'Report deletion failed',
          error: 'Report not found',
        };
      }
      
      mockReportData.splice(index, 1);
      
      return {
        success: true,
        message: 'Report deleted successfully',
      };
    }
    
    const response = await apiClient.delete<ApiResponse>(`/reports/${id}`);
    return response.data;
  }

  /**
   * Share report
   */
  async shareReport(id: string, emails: string[]): Promise<ApiResponse> {
    if (isMockMode()) {
      await mockDelay();
      
      const report = mockReportData.find(r => r.id === id);
      
      if (!report) {
        throw {
          success: false,
          message: 'Report sharing failed',
          error: 'Report not found',
        };
      }
      
      return {
        success: true,
        message: `Report shared with ${emails.length} recipient(s)`,
      };
    }
    
    const response = await apiClient.post<ApiResponse>(`/reports/${id}/share`, { emails });
    return response.data;
  }

  /**
   * Schedule report generation
   */
  async scheduleReport(data: CreateReportRequest & { schedule: string }): Promise<ApiResponse<Report>> {
    if (isMockMode()) {
      await mockDelay();
      
      const newReport: Report = {
        id: String(mockReportData.length + 1),
        title: data.title,
        description: data.description,
        type: data.type,
        period: data.period,
        generatedDate: new Date().toISOString().split('T')[0],
        status: 'scheduled',
        size: '-',
        views: 0,
        downloads: 0,
        author: 'Current User',
        tags: data.tags || [],
        favorite: false,
      };
      
      mockReportData.unshift(newReport);
      
      return {
        success: true,
        message: 'Report scheduled successfully',
        data: newReport,
      };
    }
    
    const response = await apiClient.post<ApiResponse<Report>>('/reports/schedule', data);
    return response.data;
  }
}

export default new ReportApi();
