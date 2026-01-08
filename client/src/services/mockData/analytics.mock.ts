/**
 * Mock Analytics Data
 * Sample analytics and dashboard data
 */

import { 
  AnalyticsData, 
  DashboardStats, 
  ChartData,
  RoleDistribution,
  StatusDistribution,
  Report,
  Notification,
  ActivityLog
} from '../types/api.types';

export const mockDashboardStats: DashboardStats = {
  totalUsers: 1250,
  activeUsers: 1000,
  newUsersThisMonth: 230,
  avgSessionTime: 24.5,
  userGrowth: 12.5,
  activeUserGrowth: 8.3,
  newUserGrowth: 15.2,
  sessionTimeGrowth: 3.2,
};

export const mockUserGrowthData: ChartData[] = [
  { month: 'Jan', users: 400, active: 240, new: 80, target: 350 },
  { month: 'Feb', users: 520, active: 380, new: 120, target: 450 },
  { month: 'Mar', users: 680, active: 510, new: 160, target: 600 },
  { month: 'Apr', users: 850, active: 680, new: 170, target: 750 },
  { month: 'May', users: 1020, active: 820, new: 170, target: 900 },
  { month: 'Jun', users: 1250, active: 1000, new: 230, target: 1100 },
];

export const mockActivityData: ChartData[] = [
  { day: 'Mon', logins: 420, actions: 1850, errors: 12 },
  { day: 'Tue', logins: 480, actions: 2100, errors: 8 },
  { day: 'Wed', logins: 450, actions: 1920, errors: 15 },
  { day: 'Thu', logins: 520, actions: 2250, errors: 6 },
  { day: 'Fri', logins: 490, actions: 2080, errors: 10 },
  { day: 'Sat', logins: 280, actions: 950, errors: 4 },
  { day: 'Sun', logins: 180, actions: 620, errors: 2 },
];

export const mockSecurityData: ChartData[] = [
  { week: 'W1', success: 3420, failed: 12, blocked: 3 },
  { week: 'W2', success: 3680, failed: 8, blocked: 2 },
  { week: 'W3', success: 3590, failed: 15, blocked: 5 },
  { week: 'W4', success: 3850, failed: 6, blocked: 1 },
];

export const mockRoleDistribution: RoleDistribution[] = [
  { name: 'Admin', value: 12, color: '#3b82f6' },
  { name: 'Manager', value: 35, color: '#10b981' },
  { name: 'User', value: 142, color: '#f59e0b' },
  { name: 'Guest', value: 28, color: '#6b7280' },
];

export const mockStatusDistribution: StatusDistribution[] = [
  { name: 'Active', value: 185, color: '#10b981' },
  { name: 'Inactive', value: 25, color: '#f59e0b' },
  { name: 'Suspended', value: 7, color: '#ef4444' },
];

export const mockAnalyticsData: AnalyticsData = {
  stats: mockDashboardStats,
  userGrowth: mockUserGrowthData,
  activityData: mockActivityData,
  roleDistribution: mockRoleDistribution,
  statusDistribution: mockStatusDistribution,
  securityData: mockSecurityData,
};

export const mockReports: Report[] = [
  {
    id: '1',
    title: 'Báo cáo người dùng tháng 12/2024',
    description: 'Tổng quan về hoạt động và tăng trưởng người dùng trong tháng 12 với phân tích chi tiết theo nhóm',
    type: 'user',
    period: 'Tháng 12/2024',
    generatedDate: '2025-01-01',
    status: 'ready',
    size: '2.4 MB',
    views: 145,
    downloads: 23,
    author: 'Nguyễn Văn A',
    tags: ['monthly', 'users', 'growth'],
    favorite: true,
  },
  {
    id: '2',
    title: 'Phân tích hiệu suất Q4 2024',
    description: 'Báo cáo chi tiết về hiệu suất hệ thống, thời gian phản hồi và các chỉ số kỹ thuật trong quý 4',
    type: 'performance',
    period: 'Q4 2024',
    generatedDate: '2024-12-31',
    status: 'ready',
    size: '5.1 MB',
    views: 289,
    downloads: 45,
    author: 'Trần Thị B',
    tags: ['quarterly', 'performance', 'technical'],
    favorite: true,
  },
  {
    id: '3',
    title: 'Hoạt động hệ thống tuần 52',
    description: 'Thống kê hoạt động, sự kiện và logs hệ thống tuần 52/2024',
    type: 'activity',
    period: 'Tuần 52/2024',
    generatedDate: '2024-12-30',
    status: 'ready',
    size: '1.8 MB',
    views: 134,
    downloads: 18,
    author: 'Lê Văn C',
    tags: ['weekly', 'activity', 'logs'],
    favorite: false,
  },
  {
    id: '4',
    title: 'Báo cáo bảo mật tháng 12',
    description: 'Chi tiết về các sự kiện bảo mật, đăng nhập bất thường và audit logs tháng 12/2024',
    type: 'security',
    period: 'Tháng 12/2024',
    generatedDate: '2025-01-03',
    status: 'ready',
    size: '3.2 MB',
    views: 78,
    downloads: 31,
    author: 'Hoàng Văn E',
    tags: ['monthly', 'security', 'audit'],
    favorite: true,
  },
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'User Created',
    message: 'New user "john.doe@example.com" has been created successfully',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    read: false,
    userId: '1',
    metadata: { userId: '123', action: 'create' },
  },
  {
    id: '2',
    type: 'warning',
    title: 'Failed Login Attempt',
    message: 'Multiple failed login attempts detected for user "jane.smith@example.com"',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    read: false,
    userId: '1',
    metadata: { userId: '456', attempts: 3 },
  },
  {
    id: '3',
    type: 'info',
    title: 'System Update',
    message: 'System maintenance scheduled for tomorrow at 2:00 AM',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    read: true,
    userId: '1',
  },
  {
    id: '4',
    type: 'error',
    title: 'Database Connection Error',
    message: 'Temporary database connection issue has been resolved',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: true,
    userId: '1',
  },
  {
    id: '5',
    type: 'success',
    title: 'Backup Completed',
    message: 'Daily database backup completed successfully',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    read: true,
    userId: '1',
  },
];

export const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    userId: '1',
    action: 'create',
    resource: 'user',
    resourceId: '123',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0...',
    metadata: { email: 'newuser@example.com' },
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    userId: '2',
    action: 'update',
    resource: 'user',
    resourceId: '456',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0...',
    metadata: { field: 'status', oldValue: 'active', newValue: 'inactive' },
    timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    userId: '1',
    action: 'delete',
    resource: 'user',
    resourceId: '789',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0...',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    userId: '3',
    action: 'login',
    resource: 'auth',
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0...',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    userId: '4',
    action: 'logout',
    resource: 'auth',
    ipAddress: '192.168.1.103',
    userAgent: 'Mozilla/5.0...',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
];

// Helper function to generate activity log
export function generateActivityLog(
  userId: string,
  action: string,
  resource: string,
  resourceId?: string
): ActivityLog {
  return {
    id: Math.random().toString(36).substr(2, 9),
    userId,
    action,
    resource,
    resourceId,
    ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: new Date().toISOString(),
  };
}
