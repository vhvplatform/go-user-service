# 🎯 Mock API System - Complete Documentation

## 📖 Overview

Complete Mock API system tích hợp sẵn cho **VHV Platform User Management System**, hỗ trợ phát triển frontend mà không cần backend.

---

## 🎨 Features

### ✅ **6 Complete API Services**
- **authApi** - Authentication & Authorization
- **userApi** - User Management (CRUD)
- **roleApi** - Role & Permission Management
- **analyticsApi** - Dashboard & Analytics
- **notificationApi** - Real-time Notifications
- **reportApi** - Report Generation & Management

### ✅ **Mock Data**
- 10+ sample users với roles
- 4 default roles (Admin, Manager, User, Guest)
- 6+ permissions
- Analytics & dashboard data
- Notifications & activity logs
- Reports library

### ✅ **Advanced Features**
- Auto token refresh
- Pagination support
- Search & filtering
- Sorting capabilities
- Bulk operations
- Export functionality
- Error handling
- TypeScript support

---

## 📁 File Structure

```
/src/services/
├── api/
│   ├── apiClient.ts          # Axios instance + interceptors
│   ├── authApi.ts             # Authentication endpoints
│   ├── userApi.ts             # User management endpoints
│   ├── roleApi.ts             # Role & permission endpoints
│   ├── analyticsApi.ts        # Analytics & dashboard endpoints
│   ├── notificationApi.ts     # Notification endpoints
│   ├── reportApi.ts           # Report endpoints
│   └── index.ts               # Export all APIs
│
├── mockData/
│   ├── users.mock.ts          # Mock users & roles
│   └── analytics.mock.ts      # Mock analytics data
│
└── types/
    └── api.types.ts           # TypeScript definitions

/docs/
├── API_INTEGRATION_GUIDE.md  # Complete integration guide
├── MOCK_API_README.md         # This file
└── golang-api-structure.md   # Backend API structure
```

---

## 🚀 Quick Start

### 1. Setup Environment

```bash
# Copy environment template
cp .env.example .env
```

Edit `.env`:
```env
VITE_ENVIRONMENT=dev
VITE_USE_MOCK_API=true
VITE_API_URL_DEV=http://localhost:8080/api/v1
```

### 2. Import & Use

```typescript
import { authApi, userApi, analyticsApi } from '@/services/api';

// Login
const response = await authApi.login({
  email: 'admin@vhvplatform.com',
  password: 'any-password'
});

// Get users
const users = await userApi.getUsers({ page: 1, limit: 10 });

// Get dashboard data
const analytics = await analyticsApi.getDashboardData('7d');
```

### 3. Test Accounts

| Email | Role | Password |
|-------|------|----------|
| admin@vhvplatform.com | Admin | any |
| john.doe@vhvplatform.com | Manager | any |
| jane.smith@vhvplatform.com | Manager | any |
| mike.wilson@vhvplatform.com | User | any |

---

## 📚 API Endpoints

### 🔐 Authentication (authApi)

```typescript
// Login
POST /auth/login
Body: { email, password }
Response: { user, accessToken, refreshToken, expiresIn }

// Register
POST /auth/register
Body: { email, username, password, firstName, lastName }
Response: { user, accessToken, refreshToken, expiresIn }

// Refresh Token
POST /auth/refresh
Body: { refreshToken }
Response: { accessToken, refreshToken, expiresIn }

// Logout
POST /auth/logout
Response: { success, message }

// Forgot Password
POST /auth/forgot-password
Body: { email }
Response: { success, message }

// Reset Password
POST /auth/reset-password
Body: { token, newPassword }
Response: { success, message }

// Get Current User
GET /auth/me
Response: { user }

// Change Password
POST /auth/change-password
Body: { oldPassword, newPassword }
Response: { success, message }
```

### 👥 User Management (userApi)

```typescript
// Get Users (with pagination)
GET /users?page=1&limit=10&status=active&search=john
Response: { items, page, limit, total, totalPages }

// Get User by ID
GET /users/:id
Response: { user }

// Create User
POST /users
Body: { email, username, password, firstName, lastName, roleId }
Response: { user }

// Update User
PUT /users/:id
Body: { firstName, lastName, status, ... }
Response: { user }

// Delete User
DELETE /users/:id
Response: { success, message }

// Restore User
POST /users/:id/restore
Response: { user }

// Bulk Delete
POST /users/bulk-delete
Body: { ids: ['1', '2', '3'] }
Response: { success, message }

// Export Users
GET /users/export?format=csv
Response: Blob (CSV file)

// Get User Stats
GET /users/stats
Response: { total, active, inactive, suspended, byRole }
```

### 🎭 Role Management (roleApi)

```typescript
// Get Roles
GET /roles?page=1&limit=50
Response: { items, page, limit, total, totalPages }

// Get Role by ID
GET /roles/:id
Response: { role }

// Create Role
POST /roles
Body: { name, description, permissions }
Response: { role }

// Update Role
PUT /roles/:id
Body: { name, description, permissions }
Response: { role }

// Delete Role
DELETE /roles/:id
Response: { success, message }

// Get Permissions
GET /permissions
Response: { permissions }

// Assign Permissions
POST /roles/:id/permissions
Body: { permissions: ['user:read', 'user:write'] }
Response: { success, message }
```

### 📊 Analytics (analyticsApi)

```typescript
// Get Dashboard Data
GET /analytics/dashboard?timeRange=7d
Response: { stats, userGrowth, activityData, roleDistribution, ... }

// Get User Growth
GET /analytics/user-growth?period=monthly
Response: { data }

// Get Activity Metrics
GET /analytics/activity?timeRange=7d
Response: { data }

// Get Security Metrics
GET /analytics/security?timeRange=30d
Response: { data }

// Get Role Distribution
GET /analytics/roles
Response: { data }

// Get Status Distribution
GET /analytics/status
Response: { data }

// Export Report
GET /analytics/export?format=pdf
Response: Blob (PDF file)
```

### 🔔 Notifications (notificationApi)

```typescript
// Get Notifications
GET /notifications?page=1&limit=20
Response: { items, page, limit, total, totalPages }

// Get Unread Count
GET /notifications/unread-count
Response: { count }

// Mark as Read
PATCH /notifications/:id/read
Response: { success, message }

// Mark All as Read
POST /notifications/mark-all-read
Response: { success, message }

// Delete Notification
DELETE /notifications/:id
Response: { success, message }

// Clear Read
DELETE /notifications/clear-read
Response: { success, message }

// Create Notification (Admin)
POST /notifications
Body: { type, title, message, userId }
Response: { notification }
```

### 📄 Reports (reportApi)

```typescript
// Get Reports
GET /reports?page=1&limit=10&type=user&status=ready
Response: { items, page, limit, total, totalPages }

// Get Report by ID
GET /reports/:id
Response: { report }

// Create Report
POST /reports
Body: { title, description, type, period, tags }
Response: { report }

// Download Report
GET /reports/:id/download
Response: Blob (PDF file)

// Toggle Favorite
POST /reports/:id/favorite
Response: { report }

// Delete Report
DELETE /reports/:id
Response: { success, message }

// Share Report
POST /reports/:id/share
Body: { emails: ['user@example.com'] }
Response: { success, message }

// Schedule Report
POST /reports/schedule
Body: { title, type, period, schedule }
Response: { report }
```

---

## 🔧 Configuration

### Environment Variables

```env
# Environment
VITE_ENVIRONMENT=dev|dev-shared|staging|production

# Mock API Mode
VITE_USE_MOCK_API=true|false

# API URLs
VITE_API_URL_DEV=http://localhost:8080/api/v1
VITE_API_URL_DEV_SHARED=https://dev-api.vhvplatform.com/api/v1
VITE_API_URL_STAGING=https://staging-api.vhvplatform.com/api/v1
VITE_API_URL_PRODUCTION=https://api.vhvplatform.com/api/v1
```

### Switch Environment Programmatically

```typescript
import { setEnvironment } from '@/services/api';

// Switch to staging
setEnvironment('staging');
```

---

## 💻 Usage Examples

### Example 1: Login Component

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
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toast.success('Login successful!');
        window.location.href = '/dashboard';
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (/* JSX */);
}
```

### Example 2: User List Component

```typescript
import { useState, useEffect } from 'react';
import { userApi, User } from '@/services/api';

function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadUsers();
  }, [page]);

  const loadUsers = async () => {
    const response = await userApi.getUsers({ page, limit: 10 });
    if (response.success && response.data) {
      setUsers(response.data.items);
    }
  };

  return (/* JSX */);
}
```

### Example 3: Create User with Validation

```typescript
import { userApi } from '@/services/api';
import { toast } from 'sonner';

async function handleCreateUser(data: CreateUserRequest) {
  try {
    const response = await userApi.createUser(data);
    if (response.success) {
      toast.success('User created successfully!');
      return response.data;
    }
  } catch (error: any) {
    if (error.error?.includes('email already exists')) {
      toast.error('Email already registered');
    } else {
      toast.error(error.message);
    }
  }
}
```

---

## 🎨 Mock Data

### Sample Users

```typescript
// Admin account
{
  email: 'admin@vhvplatform.com',
  username: 'admin',
  firstName: 'Admin',
  lastName: 'System',
  role: { name: 'Admin', permissions: ['user:read', 'user:write', 'user:delete', 'role:admin'] },
  status: 'active'
}

// Manager account
{
  email: 'john.doe@vhvplatform.com',
  username: 'johndoe',
  firstName: 'John',
  lastName: 'Doe',
  role: { name: 'Manager', permissions: ['user:read', 'user:write', 'content:admin'] },
  status: 'active'
}
```

### Default Roles

```typescript
const roles = [
  { id: '1', name: 'Admin', permissions: ['user:read', 'user:write', 'user:delete', 'role:admin'] },
  { id: '2', name: 'Manager', permissions: ['user:read', 'user:write', 'content:admin'] },
  { id: '3', name: 'User', permissions: ['user:read'] },
  { id: '4', name: 'Guest', permissions: ['content:read'] }
];
```

---

## 🔄 Mock vs Real API

### Development (Mock Mode)

```env
VITE_USE_MOCK_API=true
```

**Advantages:**
- ✅ No backend needed
- ✅ Fast development
- ✅ Offline development
- ✅ Consistent test data
- ✅ No API limits

### Production (Real API)

```env
VITE_USE_MOCK_API=false
```

**Advantages:**
- ✅ Real data
- ✅ Backend integration
- ✅ Production ready
- ✅ Real-time updates

---

## ⚡ Performance

### Optimizations

1. **Mock Delay Simulation**
   ```typescript
   const mockDelay = (ms: number = 500) => 
     new Promise(resolve => setTimeout(resolve, ms));
   ```

2. **Pagination**
   ```typescript
   const response = await userApi.getUsers({ page: 1, limit: 10 });
   ```

3. **Caching** (Optional)
   ```typescript
   localStorage.setItem('cachedUsers', JSON.stringify(users));
   ```

---

## 🛡️ Security

### Token Management

```typescript
// Auto-refresh on 401
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Auto refresh token
      const newToken = await authApi.refreshToken({ refreshToken });
      // Retry request
    }
  }
);
```

### Protected Routes

```typescript
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('accessToken');
  if (!token) return <Navigate to="/login" />;
  return children;
}
```

---

## 📝 TypeScript Support

### Full Type Definitions

```typescript
import type { 
  User, 
  Role, 
  CreateUserRequest,
  ApiResponse,
  PaginatedResponse 
} from '@/services/api';

const user: User = { /* ... */ };
const response: ApiResponse<User> = await userApi.getUserById('1');
```

---

## 🧪 Testing

### Unit Test Example

```typescript
import { userApi } from '@/services/api';

describe('User API', () => {
  it('should create user', async () => {
    const data = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      roleId: '3'
    };

    const response = await userApi.createUser(data);
    expect(response.success).toBe(true);
    expect(response.data?.email).toBe(data.email);
  });
});
```

---

## 📖 Additional Resources

- [API Integration Guide](/docs/API_INTEGRATION_GUIDE.md)
- [Golang API Structure](/docs/golang-api-structure.md)
- [Environment Setup Guide](/.env.example)

---

## 🎯 Summary

✅ **6 Complete API Services** - Ready to use  
✅ **Mock Data** - 10+ users, roles, analytics  
✅ **TypeScript** - Full type safety  
✅ **Auto Token Refresh** - Seamless auth  
✅ **Error Handling** - Production ready  
✅ **Documentation** - Complete guides  

**Ready for production!** 🚀

---

## 📞 Support

For questions or issues:
- Check [API Integration Guide](/docs/API_INTEGRATION_GUIDE.md)
- Review mock data in `/src/services/mockData/`
- Inspect API services in `/src/services/api/`

**Happy coding!** 💻✨
