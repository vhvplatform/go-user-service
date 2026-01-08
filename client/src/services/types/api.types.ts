/**
 * API Types and Interfaces
 * Central type definitions for all API operations
 */

// ==================== Common Types ====================

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  error: string;
  statusCode?: number;
}

// ==================== User Types ====================

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'suspended';
  roleId: string;
  role?: Role;
  lastLoginAt?: string;
  loginCount: number;
  failedAttempts: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CreateUserRequest {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  roleId: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  avatar?: string;
  status?: 'active' | 'inactive' | 'suspended';
}

export interface UserListParams {
  page?: number;
  limit?: number;
  status?: string;
  roleId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ==================== Auth Types ====================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// ==================== Role Types ====================

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleRequest {
  name: string;
  description: string;
  permissions: string[];
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  permissions?: string[];
}

// ==================== Permission Types ====================

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: 'read' | 'write' | 'delete' | 'admin';
  description: string;
  createdAt: string;
}

// ==================== Analytics Types ====================

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  avgSessionTime: number;
  userGrowth: number;
  activeUserGrowth: number;
  newUserGrowth: number;
  sessionTimeGrowth: number;
}

export interface ChartData {
  month?: string;
  day?: string;
  week?: string;
  users?: number;
  active?: number;
  new?: number;
  logins?: number;
  actions?: number;
  errors?: number;
  success?: number;
  failed?: number;
  blocked?: number;
  target?: number;
}

export interface RoleDistribution {
  name: string;
  value: number;
  color: string;
}

export interface StatusDistribution {
  name: string;
  value: number;
  color: string;
}

export interface AnalyticsData {
  stats: DashboardStats;
  userGrowth: ChartData[];
  activityData: ChartData[];
  roleDistribution: RoleDistribution[];
  statusDistribution: StatusDistribution[];
  securityData: ChartData[];
}

// ==================== Report Types ====================

export interface Report {
  id: string;
  title: string;
  description: string;
  type: 'user' | 'activity' | 'performance' | 'system' | 'security' | 'custom';
  period: string;
  generatedDate: string;
  status: 'ready' | 'generating' | 'scheduled' | 'failed';
  size: string;
  views: number;
  downloads: number;
  author: string;
  tags: string[];
  favorite: boolean;
}

export interface CreateReportRequest {
  title: string;
  description: string;
  type: Report['type'];
  period: string;
  tags?: string[];
}

// ==================== Notification Types ====================

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  userId: string;
  metadata?: Record<string, any>;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  notificationTypes: {
    security: boolean;
    updates: boolean;
    marketing: boolean;
  };
}

// ==================== Settings Types ====================

export interface UserSettings {
  userId: string;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notifications: NotificationSettings;
  privacy: {
    profileVisibility: 'public' | 'private';
    showEmail: boolean;
    showPhone: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
  };
}

// ==================== Session Types ====================

export interface Session {
  id: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  ipAddress: string;
  userAgent: string;
  expiresAt: string;
  createdAt: string;
  isActive: boolean;
}

// ==================== Activity Log Types ====================

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress: string;
  userAgent: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface ActivityLogParams {
  userId?: string;
  action?: string;
  resource?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
