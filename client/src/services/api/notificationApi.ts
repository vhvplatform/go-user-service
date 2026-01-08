/**
 * Notification API Service
 * Notification management endpoints
 */

import apiClient, { isMockMode } from './apiClient';
import { ApiResponse, PaginatedResponse, Notification } from '../types/api.types';
import { mockNotifications } from '../mockData/analytics.mock';

const mockDelay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

let mockNotificationData = [...mockNotifications];

class NotificationApi {
  /**
   * Get all notifications with pagination
   */
  async getNotifications(page: number = 1, limit: number = 20): Promise<PaginatedResponse<Notification>> {
    if (isMockMode()) {
      await mockDelay();
      
      const total = mockNotificationData.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const items = mockNotificationData.slice(startIndex, endIndex);
      
      return {
        success: true,
        message: 'Notifications retrieved successfully',
        data: {
          items,
          page,
          limit,
          total,
          totalPages,
        },
      };
    }
    
    const response = await apiClient.get<PaginatedResponse<Notification>>('/notifications', {
      params: { page, limit },
    });
    return response.data;
  }

  /**
   * Get unread notifications count
   */
  async getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
    if (isMockMode()) {
      await mockDelay(100);
      
      const unreadCount = mockNotificationData.filter(n => !n.read).length;
      
      return {
        success: true,
        message: 'Unread count retrieved successfully',
        data: { count: unreadCount },
      };
    }
    
    const response = await apiClient.get<ApiResponse<{ count: number }>>('/notifications/unread-count');
    return response.data;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(id: string): Promise<ApiResponse> {
    if (isMockMode()) {
      await mockDelay(200);
      
      const notification = mockNotificationData.find(n => n.id === id);
      if (notification) {
        notification.read = true;
      }
      
      return {
        success: true,
        message: 'Notification marked as read',
      };
    }
    
    const response = await apiClient.patch<ApiResponse>(`/notifications/${id}/read`);
    return response.data;
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<ApiResponse> {
    if (isMockMode()) {
      await mockDelay();
      
      mockNotificationData.forEach(n => {
        n.read = true;
      });
      
      return {
        success: true,
        message: 'All notifications marked as read',
      };
    }
    
    const response = await apiClient.post<ApiResponse>('/notifications/mark-all-read');
    return response.data;
  }

  /**
   * Delete notification
   */
  async deleteNotification(id: string): Promise<ApiResponse> {
    if (isMockMode()) {
      await mockDelay(200);
      
      const index = mockNotificationData.findIndex(n => n.id === id);
      if (index !== -1) {
        mockNotificationData.splice(index, 1);
      }
      
      return {
        success: true,
        message: 'Notification deleted successfully',
      };
    }
    
    const response = await apiClient.delete<ApiResponse>(`/notifications/${id}`);
    return response.data;
  }

  /**
   * Clear all read notifications
   */
  async clearRead(): Promise<ApiResponse> {
    if (isMockMode()) {
      await mockDelay();
      
      mockNotificationData = mockNotificationData.filter(n => !n.read);
      
      return {
        success: true,
        message: 'Read notifications cleared',
      };
    }
    
    const response = await apiClient.delete<ApiResponse>('/notifications/clear-read');
    return response.data;
  }

  /**
   * Create notification (admin only)
   */
  async createNotification(data: Omit<Notification, 'id' | 'timestamp' | 'read'>): Promise<ApiResponse<Notification>> {
    if (isMockMode()) {
      await mockDelay();
      
      const newNotification: Notification = {
        ...data,
        id: String(mockNotificationData.length + 1),
        timestamp: new Date().toISOString(),
        read: false,
      };
      
      mockNotificationData.unshift(newNotification);
      
      return {
        success: true,
        message: 'Notification created successfully',
        data: newNotification,
      };
    }
    
    const response = await apiClient.post<ApiResponse<Notification>>('/notifications', data);
    return response.data;
  }

  /**
   * Subscribe to push notifications
   */
  async subscribePush(subscription: PushSubscription): Promise<ApiResponse> {
    if (isMockMode()) {
      await mockDelay();
      
      return {
        success: true,
        message: 'Push notification subscription successful',
      };
    }
    
    const response = await apiClient.post<ApiResponse>('/notifications/subscribe-push', subscription);
    return response.data;
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribePush(): Promise<ApiResponse> {
    if (isMockMode()) {
      await mockDelay();
      
      return {
        success: true,
        message: 'Push notification unsubscription successful',
      };
    }
    
    const response = await apiClient.post<ApiResponse>('/notifications/unsubscribe-push');
    return response.data;
  }
}

export default new NotificationApi();
