# 🔌 API Integration Guide

Complete guide for integrating the Mock API with your React application.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Environment Setup](#environment-setup)
3. [API Services Overview](#api-services-overview)
4. [Usage Examples](#usage-examples)
5. [Mock Mode vs Real API](#mock-mode-vs-real-api)
6. [Error Handling](#error-handling)
7. [Authentication Flow](#authentication-flow)
8. [Best Practices](#best-practices)

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install axios
```

### 2. Setup Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update `.env` values:

```env
VITE_ENVIRONMENT=dev
VITE_USE_MOCK_API=true
VITE_API_URL_DEV=http://localhost:8080/api/v1
```

### 3. Import and Use API Services

```typescript
import { authApi, userApi, analyticsApi } from '@/services/api';

// Login
const response = await authApi.login({
  email: 'admin@vhvplatform.com',
  password: 'password123'
});

// Get users
const users = await userApi.getUsers({ page: 1, limit: 10 });

// Get analytics
const analytics = await analyticsApi.getDashboardData('7d');
```

---

## ⚙️ Environment Setup

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_ENVIRONMENT` | Current environment | `dev` |
| `VITE_USE_MOCK_API` | Use mock data | `true` |
| `VITE_API_URL_DEV` | Dev API URL | `http://localhost:8080/api/v1` |
| `VITE_API_URL_DEV_SHARED` | Dev-shared API URL | - |
| `VITE_API_URL_STAGING` | Staging API URL | - |
| `VITE_API_URL_PRODUCTION` | Production API URL | - |

### Switching Environments

```typescript
import { setEnvironment } from '@/services/api';

// Switch to staging
setEnvironment('staging');

// Switch to production
setEnvironment('production');
```

---

## 📚 API Services Overview

### 1. **authApi** - Authentication

```typescript
import { authApi } from '@/services/api';

// Login
await authApi.login({ email, password });

// Register
await authApi.register({ email, username, password, firstName, lastName });

// Refresh token
await authApi.refreshToken({ refreshToken });

// Logout
await authApi.logout();

// Forgot password
await authApi.forgotPassword(email);

// Reset password
await authApi.resetPassword({ token, newPassword });

// Get current user
await authApi.getCurrentUser();

// Change password
await authApi.changePassword(oldPassword, newPassword);
```

### 2. **userApi** - User Management

```typescript
import { userApi } from '@/services/api';

// Get users (paginated)
await userApi.getUsers({
  page: 1,
  limit: 10,
  status: 'active',
  roleId: '1',
  search: 'john',
  sortBy: 'createdAt',
  sortOrder: 'desc'
});

// Get user by ID
await userApi.getUserById('123');

// Create user
await userApi.createUser({
  email: 'new@example.com',
  username: 'newuser',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
  roleId: '3'
});

// Update user
await userApi.updateUser('123', {
  firstName: 'Jane',
  status: 'inactive'
});

// Delete user
await userApi.deleteUser('123');

// Restore user
await userApi.restoreUser('123');

// Bulk delete
await userApi.bulkDeleteUsers(['1', '2', '3']);

// Export users
const blob = await userApi.exportUsers();

// Get user statistics
await userApi.getUserStats();
```

### 3. **roleApi** - Role Management

```typescript
import { roleApi } from '@/services/api';

// Get roles
await roleApi.getRoles(1, 50);

// Get role by ID
await roleApi.getRoleById('1');

// Create role
await roleApi.createRole({
  name: 'Editor',
  description: 'Content editor role',
  permissions: ['content:read', 'content:write']
});

// Update role
await roleApi.updateRole('1', {
  description: 'Updated description',
  permissions: ['user:read', 'user:write']
});

// Delete role
await roleApi.deleteRole('1');

// Get all permissions
await roleApi.getPermissions();

// Assign permissions to role
await roleApi.assignPermissions('1', ['user:read', 'user:write']);
```

### 4. **analyticsApi** - Analytics & Dashboard

```typescript
import { analyticsApi } from '@/services/api';

// Get dashboard data
await analyticsApi.getDashboardData('7d');

// Get user growth
await analyticsApi.getUserGrowth('monthly');

// Get activity metrics
await analyticsApi.getActivityMetrics('7d');

// Get security metrics
await analyticsApi.getSecurityMetrics('30d');

// Get role distribution
await analyticsApi.getRoleDistribution();

// Get status distribution
await analyticsApi.getStatusDistribution();

// Export analytics report
const blob = await analyticsApi.exportReport('pdf');
```

### 5. **notificationApi** - Notifications

```typescript
import { notificationApi } from '@/services/api';

// Get notifications
await notificationApi.getNotifications(1, 20);

// Get unread count
await notificationApi.getUnreadCount();

// Mark as read
await notificationApi.markAsRead('123');

// Mark all as read
await notificationApi.markAllAsRead();

// Delete notification
await notificationApi.deleteNotification('123');

// Clear read notifications
await notificationApi.clearRead();

// Create notification (admin)
await notificationApi.createNotification({
  type: 'info',
  title: 'System Update',
  message: 'New features available',
  userId: '1'
});
```

### 6. **reportApi** - Report Management

```typescript
import { reportApi } from '@/services/api';

// Get reports
await reportApi.getReports(1, 10, 'user', 'ready');

// Get report by ID
await reportApi.getReportById('123');

// Create report
await reportApi.createReport({
  title: 'Monthly Report',
  description: 'User activity report',
  type: 'user',
  period: 'January 2025',
  tags: ['monthly', 'users']
});

// Download report
const blob = await reportApi.downloadReport('123');

// Toggle favorite
await reportApi.toggleFavorite('123');

// Delete report
await reportApi.deleteReport('123');

// Share report
await reportApi.shareReport('123', ['user1@example.com', 'user2@example.com']);

// Schedule report
await reportApi.scheduleReport({
  title: 'Weekly Report',
  type: 'activity',
  period: 'Weekly',
  schedule: '0 9 * * 1' // Every Monday at 9 AM
});
```

---

## 💡 Usage Examples

### Example 1: Login Flow in Component

```typescript
import { useState } from 'react';
import { authApi } from '@/services/api';
import { toast } from 'sonner';

function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const response = await authApi.login({ email, password });
      
      if (response.success && response.data) {
        // Store tokens
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        toast.success('Login successful!');
        
        // Redirect to dashboard
        window.location.href = '/dashboard';
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Your login form JSX
  );
}
```

### Example 2: Fetch Users with Pagination

```typescript
import { useState, useEffect } from 'react';
import { userApi, User } from '@/services/api';

function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const response = await userApi.getUsers({
        page,
        limit: 10,
        status: 'active'
      });
      
      if (response.success && response.data) {
        setUsers(response.data.items);
        setTotal(response.data.total);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Your user list JSX
  );
}
```

### Example 3: Create User with Validation

```typescript
import { userApi } from '@/services/api';
import { toast } from 'sonner';

async function createUser(data: CreateUserRequest) {
  try {
    const response = await userApi.createUser(data);
    
    if (response.success) {
      toast.success('User created successfully!');
      return response.data;
    }
  } catch (error: any) {
    // Handle specific errors
    if (error.error?.includes('email already exists')) {
      toast.error('This email is already registered');
    } else if (error.error?.includes('username already exists')) {
      toast.error('This username is already taken');
    } else {
      toast.error(error.message || 'Failed to create user');
    }
    throw error;
  }
}
```

---

## 🔄 Mock Mode vs Real API

### Mock Mode (Development)

```env
VITE_USE_MOCK_API=true
```

**Benefits:**
- ✅ No backend required
- ✅ Fast development
- ✅ Consistent test data
- ✅ Offline development
- ✅ No API rate limits

### Real API Mode (Production)

```env
VITE_USE_MOCK_API=false
```

**Benefits:**
- ✅ Real data
- ✅ Actual backend integration
- ✅ Production-ready
- ✅ Real-time updates

### Checking Current Mode

```typescript
import { isMockMode } from '@/services/api';

if (isMockMode()) {
  console.log('Using mock data');
} else {
  console.log('Using real API');
}
```

---

## ⚠️ Error Handling

### Global Error Handling (Interceptor)

The API client automatically handles:
- 401 Unauthorized → Auto token refresh
- Token expiration → Redirect to login
- Network errors → Error logging

### Component-Level Error Handling

```typescript
import { ApiError } from '@/services/api';

try {
  await userApi.getUsers();
} catch (error) {
  const apiError = error as ApiError;
  
  console.error('Error:', apiError.message);
  console.error('Details:', apiError.error);
  console.error('Status:', apiError.statusCode);
  
  // Show user-friendly message
  toast.error(apiError.message);
}
```

### Custom Error Handler Hook

```typescript
import { useCallback } from 'react';
import { toast } from 'sonner';

export function useApiError() {
  const handleError = useCallback((error: any) => {
    if (error.statusCode === 401) {
      toast.error('Session expired. Please login again.');
      window.location.href = '/login';
    } else if (error.statusCode === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (error.statusCode === 404) {
      toast.error('Resource not found.');
    } else if (error.statusCode >= 500) {
      toast.error('Server error. Please try again later.');
    } else {
      toast.error(error.message || 'An error occurred');
    }
  }, []);

  return { handleError };
}
```

---

## 🔐 Authentication Flow

### 1. Login

```typescript
const response = await authApi.login({ email, password });

// Store tokens
localStorage.setItem('accessToken', response.data.accessToken);
localStorage.setItem('refreshToken', response.data.refreshToken);
localStorage.setItem('user', JSON.stringify(response.data.user));
```

### 2. Auto Token Refresh

API client automatically refreshes expired tokens:

```typescript
// Interceptor handles this automatically
// No manual intervention needed
```

### 3. Protected Routes

```typescript
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  return children;
}
```

### 4. Logout

```typescript
await authApi.logout();

// Clear local storage
localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');
localStorage.removeItem('user');

// Redirect to login
window.location.href = '/login';
```

---

## ✨ Best Practices

### 1. Use TypeScript Types

```typescript
import { User, CreateUserRequest, ApiResponse } from '@/services/api';

const user: User = response.data;
const createData: CreateUserRequest = { /* ... */ };
```

### 2. Handle Loading States

```typescript
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    await api.getData();
  } finally {
    setLoading(false);
  }
};
```

### 3. Use Error Boundaries

```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

<ErrorBoundary>
  <UserManagement />
</ErrorBoundary>
```

### 4. Implement Retry Logic

```typescript
async function fetchWithRetry(fn: () => Promise<any>, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

// Usage
await fetchWithRetry(() => userApi.getUsers());
```

### 5. Cache API Responses

```typescript
import { useState, useEffect } from 'react';

function useCachedApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  cacheKey: string,
  ttl: number = 5 * 60 * 1000 // 5 minutes
) {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < ttl) {
        setData(data);
        return;
      }
    }

    apiCall().then(response => {
      if (response.success && response.data) {
        setData(response.data);
        localStorage.setItem(
          cacheKey,
          JSON.stringify({ data: response.data, timestamp: Date.now() })
        );
      }
    });
  }, []);

  return data;
}
```

---

## 🎯 Summary

✅ **Complete API integration** with 6 services  
✅ **Mock mode** for development without backend  
✅ **TypeScript support** with full type definitions  
✅ **Auto token refresh** and error handling  
✅ **Environment-based** configuration  
✅ **Production-ready** architecture  

**Ready to integrate!** 🚀
