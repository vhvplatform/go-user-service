# VHV Platform - API Usage Guide

## Tổng quan

Hệ thống VHV Platform cung cấp một API client thống nhất hỗ trợ cả **Mock Data** (development) và **Real API** (production). API client tự động chuyển đổi giữa hai chế độ dựa trên cấu hình môi trường.

## Cấu hình

### 1. Environment Variables

Tạo file `.env` trong thư mục gốc của project:

```env
# Environment: dev | dev-shared | staging | production
VITE_ENVIRONMENT=dev

# Use Mock Data (true/false)
VITE_USE_MOCK_DATA=true

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_DARK_MODE=true
```

### 2. Môi trường

Hệ thống hỗ trợ 4 môi trường:

- **dev**: Development (Local) - `http://localhost:8080`
- **dev-shared**: Development (Shared) - `https://api-dev.vhvplatform.com`
- **staging**: Staging - `https://api-staging.vhvplatform.com`
- **production**: Production - `https://api.vhvplatform.com`

## Import và Sử dụng

### Basic Import

```typescript
import { api } from '@/services/apiClient';
import { isUsingMockData, getCurrentEnvironment } from '@/config/apiConfig';
```

### Kiểm tra chế độ

```typescript
// Kiểm tra đang dùng mock data hay real API
if (isUsingMockData()) {
  console.log('Using Mock Data');
} else {
  console.log('Using Real API');
}

// Lấy môi trường hiện tại
const env = getCurrentEnvironment(); // 'dev' | 'dev-shared' | 'staging' | 'production'
```

## API Services

### 1. Authentication (`api.auth`)

#### Login

```typescript
try {
  const response = await api.auth.login({
    username: 'admin',
    password: 'admin123'
  });
  
  console.log('Login successful:', response.data);
} catch (error) {
  console.error('Login failed:', error);
}
```

#### Get Current User

```typescript
const response = await api.auth.getCurrentUser();
console.log('Current user:', response.data);
```

#### Logout

```typescript
await api.auth.logout();
```

#### Register

```typescript
const response = await api.auth.register({
  username: 'newuser',
  email: 'user@example.com',
  password: 'password123',
  fullName: 'New User'
});
```

#### Refresh Token

```typescript
const response = await api.auth.refreshToken();
```

---

### 2. User Management (`api.user`)

#### Get All Users (with pagination)

```typescript
const response = await api.user.getAll({
  page: 1,
  limit: 10,
  search: 'john',
  status: 'active',
  role: 'admin'
});

console.log('Users:', response.data.users);
console.log('Total:', response.data.total);
```

#### Get User by ID

```typescript
const response = await api.user.getById('user-123');
console.log('User:', response.data);
```

#### Create User

```typescript
const response = await api.user.create({
  username: 'johndoe',
  email: 'john@example.com',
  password: 'password123',
  fullName: 'John Doe',
  role: 'user',
  department: 'IT'
});
```

#### Update User

```typescript
const response = await api.user.update('user-123', {
  fullName: 'John Doe Updated',
  phone: '0901234567',
  status: 'active'
});
```

#### Delete User

```typescript
await api.user.delete('user-123');
```

#### Bulk Update

```typescript
await api.user.bulkUpdate(['user-1', 'user-2', 'user-3'], {
  status: 'active',
  department: 'Engineering'
});
```

#### Search Users

```typescript
const response = await api.user.search('john');
console.log('Search results:', response.data);
```

---

### 3. Role Management (`api.role`)

#### Get All Roles

```typescript
const response = await api.role.getAll();
console.log('Roles:', response.data);
```

#### Get Role by ID

```typescript
const response = await api.role.getById('role-1');
console.log('Role:', response.data);
```

#### Create Role

```typescript
const response = await api.role.create({
  name: 'Editor',
  description: 'Can edit content',
  permissions: ['read', 'write', 'edit']
});
```

#### Update Role

```typescript
const response = await api.role.update('role-1', {
  name: 'Senior Editor',
  permissions: ['read', 'write', 'edit', 'publish']
});
```

#### Delete Role

```typescript
await api.role.delete('role-1');
```

---

### 4. Analytics (`api.analytics`)

#### Get Overview

```typescript
const response = await api.analytics.getOverview();
console.log('Analytics overview:', response.data);
```

#### Get User Stats

```typescript
const response = await api.analytics.getUserStats();
console.log('User statistics:', response.data);
```

#### Get Activity Stats

```typescript
const response = await api.analytics.getActivityStats('7d'); // '7d', '30d', '90d'
console.log('Activity stats:', response.data);
```

#### Get Performance Metrics

```typescript
const response = await api.analytics.getPerformanceMetrics();
console.log('Performance:', response.data);
```

---

### 5. Notifications (`api.notification`)

#### Get All Notifications

```typescript
const response = await api.notification.getAll();
console.log('Notifications:', response.data);
```

#### Get Notification by ID

```typescript
const response = await api.notification.getById('notif-1');
```

#### Create Notification

```typescript
const response = await api.notification.create({
  type: 'info',
  title: 'New Update',
  message: 'System has been updated',
  userId: 'user-123'
});
```

#### Mark as Read

```typescript
await api.notification.markAsRead('notif-1');
```

#### Mark All as Read

```typescript
await api.notification.markAllAsRead();
```

#### Delete Notification

```typescript
await api.notification.delete('notif-1');
```

---

### 6. Reports (`api.report`)

#### Get All Reports

```typescript
const response = await api.report.getAll();
console.log('Reports:', response.data);
```

#### Get Report by ID

```typescript
const response = await api.report.getById('report-1');
```

#### Generate Report

```typescript
const response = await api.report.generate('user-activity', {
  startDate: '2025-01-01',
  endDate: '2025-01-31',
  format: 'pdf'
});
```

#### Export Report

```typescript
const response = await api.report.export('report-1', 'pdf'); // 'pdf', 'excel', 'csv'
```

#### Delete Report

```typescript
await api.report.delete('report-1');
```

---

## Error Handling

### Cách xử lý lỗi

```typescript
try {
  const response = await api.user.getById('user-123');
  console.log('Success:', response.data);
} catch (error: any) {
  console.error('Error:', error.message);
  
  // Handle specific error codes
  if (error.code === 'TIMEOUT') {
    console.error('Request timeout');
  } else if (error.status === 404) {
    console.error('User not found');
  } else if (error.status === 401) {
    console.error('Unauthorized - please login');
  }
}
```

### Error Types

```typescript
interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
```

Common error codes:
- `TIMEOUT` - Request timeout
- `NETWORK_ERROR` - Network connection failed
- HTTP status codes: 400, 401, 403, 404, 500, etc.

---

## React Component Examples

### Example 1: Fetch Users in Component

```typescript
import { useState, useEffect } from 'react';
import { api } from '@/services/apiClient';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const response = await api.user.getAll({ page: 1, limit: 10 });
        setUsers(response.data.users);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.fullName}</div>
      ))}
    </div>
  );
}
```

### Example 2: Create User Form

```typescript
import { useState } from 'react';
import { api } from '@/services/apiClient';
import { toast } from 'sonner';

function CreateUserForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await api.user.create(formData);
      toast.success('User created successfully!');
      console.log('Created user:', response.data);
    } catch (error: any) {
      toast.error(`Failed: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        placeholder="Username"
      />
      {/* ... other fields ... */}
      <button type="submit">Create User</button>
    </form>
  );
}
```

---

## Switching Between Mock and Real API

### Development (Mock Data)

```env
VITE_ENVIRONMENT=dev
VITE_USE_MOCK_DATA=true
```

- Tất cả API calls sẽ sử dụng mock data
- Data được lưu trong memory
- Không cần backend server

### Production (Real API)

```env
VITE_ENVIRONMENT=production
VITE_USE_MOCK_DATA=false
```

- API calls sẽ kết nối đến backend thực tế
- Cần cấu hình backend server
- Data được lưu trong database

### Staging (Test with Real API)

```env
VITE_ENVIRONMENT=staging
VITE_USE_MOCK_DATA=false
```

---

## Best Practices

### 1. Always Handle Errors

```typescript
try {
  const response = await api.user.getAll();
  // Handle success
} catch (error) {
  // Always handle errors
  console.error('Error:', error);
}
```

### 2. Use Loading States

```typescript
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    const response = await api.user.getAll();
    // Process data
  } finally {
    setLoading(false);
  }
};
```

### 3. Implement Retry Logic (if needed)

```typescript
async function fetchWithRetry(apiCall: () => Promise<any>, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

// Usage
const response = await fetchWithRetry(() => api.user.getAll());
```

### 4. Use Environment Checker

```typescript
import { isUsingMockData } from '@/config/apiConfig';

if (isUsingMockData()) {
  console.log('Development mode - using mock data');
  // Show development banner
} else {
  console.log('Production mode - using real API');
  // Hide development features
}
```

---

## Testing

### Unit Test Example

```typescript
import { api } from '@/services/apiClient';

describe('User API', () => {
  it('should fetch users successfully', async () => {
    const response = await api.user.getAll({ page: 1, limit: 10 });
    
    expect(response.success).toBe(true);
    expect(response.data.users).toBeInstanceOf(Array);
  });

  it('should create user successfully', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Test User'
    };

    const response = await api.user.create(userData);
    expect(response.success).toBe(true);
    expect(response.data.username).toBe(userData.username);
  });
});
```

---

## Troubleshooting

### Issue: API calls not working

**Solution**: Check your `.env` file configuration:
1. Ensure `VITE_ENVIRONMENT` is set correctly
2. Verify `VITE_USE_MOCK_DATA` value
3. Restart dev server after changing .env

### Issue: CORS errors in production

**Solution**: Configure backend CORS settings to allow frontend domain

### Issue: Timeout errors

**Solution**: Increase timeout in `/src/config/apiConfig.ts`:

```typescript
export const apiConfig: ApiConfig = {
  // ...
  timeout: 60000, // Increase to 60 seconds
};
```

---

## Additional Resources

- [Mock API Documentation](./MOCK_API_README.md)
- [Golang Backend API Structure](./golang-api-structure.md)
- [API Demo Component](/src/app/components/ApiDemo.tsx)

---

**Created**: January 2025  
**Last Updated**: January 2025  
**Version**: 1.0.0
