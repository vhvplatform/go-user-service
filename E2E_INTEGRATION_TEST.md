# End-to-End Integration Test Guide

## Mục tiêu
Chạy đầy đủ stack: API Gateway → Auth Service → Tenant Service → User Service → React Frontend

## Prerequisites

### 1. MongoDB & Redis
Đảm bảo kết nối được đến:
- MongoDB: `192.168.1.203:27017,192.168.1.222:27017,192.168.1.223:27017`
- Redis: `192.168.1.203:6379`

Test connection:
```bash
# Test MongoDB
mongosh "mongodb://colombo:SASSMongoDB%232627@192.168.1.203:27017/saas_framework?authSource=admin"

# Test Redis
redis-cli -h 192.168.1.203 -p 6379 PING
```

### 2. Environment Files
Đã copy `.env.dev` → `.env` cho tất cả services ✅

## Step-by-Step Startup

### Terminal 1: Auth Service
```bash
cd e:\NewFrameWork\go-auth-service\server
go run cmd/main.go
```

**Expected Output:**
```
{"level":"info","timestamp":"...","message":"Starting Auth Service"}
{"level":"info","timestamp":"...","message":"Connected to MongoDB"}
{"level":"info","timestamp":"...","message":"gRPC server listening","port":"50051"}
{"level":"info","timestamp":"...","message":"HTTP server listening","port":"8081"}
```

**Troubleshooting:**
- ❌ MongoDB connection failed → Check network, credentials
- ❌ Port already in use → Kill process on port 50051/8081

### Terminal 2: Tenant Service
```bash
cd e:\NewFrameWork\go-tenant-service\server
go run cmd/main.go
```

**Expected Output:**
```
{"level":"info","message":"Starting Tenant Service"}
{"level":"info","message":"gRPC server listening","port":"50053"}
{"level":"info","message":"HTTP server listening","port":"8083"}
```

### Terminal 3: User Service
```bash
cd e:\NewFrameWork\go-user-service\server
go run cmd/main.go
```

**Expected Output:**
```
{"level":"info","message":"Starting User Service"}
{"level":"info","message":"Connected to MongoDB"}
{"level":"info","message":"gRPC server listening","port":"50052"}
{"level":"info","message":"HTTP server listening","port":"8082"}
```

### Terminal 4: API Gateway
```bash
cd e:\NewFrameWork\go-api-gateway\server
go run cmd/main.go
```

**Expected Output:**
```
{"level":"info","message":"Starting API Gateway"}
{"level":"info","message":"Gateway listening","port":"8080"}
[GIN-debug] GET    /api/auth/login
[GIN-debug] GET    /api/user/users
...
```

### Terminal 5: React Frontend
```bash
cd e:\NewFrameWork\go-user-service\client
pnpm install
pnpm dev
```

**Expected Output:**
```
  VITE v6.3.5  ready in 664 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose

 ✓ Ready in 2.5s
```

## Health Checks

Once all services are running, verify:

```bash
# API Gateway
curl http://localhost:8080/health
# Expected: {"status":"ok"}

# Auth Service (direct)
curl http://localhost:8081/health

# User Service (direct)
curl http://localhost:8082/health

# Tenant Service (direct)
curl http://localhost:8083/health
```

## Test Flow

### 1. Register User (via Gateway)
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@1234",
    "tenant_id": "tenant_001",
    "first_name": "Test",
    "last_name": "User"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGc...",
    "refresh_token": "eyJhbGc...",
    "user": {
      "id": "...",
      "email": "test@example.com"
    }
  }
}
```

### 2. Login (via Gateway)
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@1234"
  }'
```

Save the `access_token` from response.

### 3. Get Users (via Gateway, with Auth)
```bash
export TOKEN="<your_access_token_here>"

curl http://localhost:8080/api/user/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Tenant-ID: tenant_001"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "email": "test@example.com",
      "first_name": "Test",
      "last_name": "User"
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 1
  }
}
```

### 4. Create User (via Gateway)
```bash
curl -X POST http://localhost:8080/api/user/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Tenant-ID: tenant_001" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "NewUser@1234",
    "first_name": "New",
    "last_name": "User",
    "phone": "+84123456789"
  }'
```

### 5. Update User (via Gateway)
```bash
export USER_ID="<user_id_from_create>"

curl -X PUT http://localhost:8080/api/user/users/$USER_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Tenant-ID: tenant_001" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Updated",
    "last_name": "Name"
  }'
```

### 6. Delete User (via Gateway)
```bash
curl -X DELETE http://localhost:8080/api/user/users/$USER_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Tenant-ID: tenant_001"
```

## React Frontend Testing

### Access UI
Open browser: `http://localhost:3000`

**Expected Pages:**
1. **Login Page** (`/auth/login`)
   - Email/Password form
   - Calls `/api/auth/login` via Gateway

2. **User List Page** (`/users`)
   - Table showing all users
   - CRUD buttons (Create, Edit, Delete)
   - All API calls go through Gateway

### Test User CRUD in UI
1. Login with `test@example.com` / `Test@1234`
2. Navigate to Users page
3. Click "Create User" → Fill form → Submit
4. Click "Edit" on a user → Update → Save
5. Click "Delete" on a user → Confirm

**Verify in Network Tab:**
- All requests go to `http://localhost:8080/api/*`
- Authorization header present
- X-Tenant-ID header present

## Common Issues

### Issue 1: Port Already in Use
```
Error: listen tcp :8080: bind: address already in use
```

**Fix:**
```bash
# Find process
netstat -ano | findstr :8080

# Kill process
taskkill /PID <PID> /F
```

### Issue 2: MongoDB Connection Failed
```
Error: server selection timeout
```

**Fix:**
- Check VPN connection
- Verify MongoDB credentials
- Test with `mongosh` directly

### Issue 3: gRPC Connection Refused
```
Error: connection refused to auth-service
```

**Fix:**
- Ensure Auth Service is running
- Check `.env` has correct `AUTH_SERVICE_GRPC_ADDR`
- Verify no firewall blocking

### Issue 4: CORS Error in Browser
```
Access to fetch at 'http://localhost:8080/api/...' has been blocked by CORS
```

**Fix:**
- Check Gateway `.env` has `CORS_ALLOWED_ORIGINS=http://localhost:3000`
- Restart Gateway after changing CORS config

### Issue 5: 401 Unauthorized
```
{"error":"Invalid or expired token"}
```

**Fix:**
- Token expired → Login again
- Token not sent → Check Authorization header
- Check JWT_SECRET matches across Auth Service and Gateway

## Architecture Verification

```
Browser (localhost:3000)
    │
    ├─→ GET /users → Next.js SSR
    │
    └─→ POST /api/auth/login
            │
            ▼
        API Gateway (localhost:8080)
            │
            ├─→ /api/auth/* → Auth Service (localhost:8081)
            │                      │
            │                      └─→ MongoDB
            │
            ├─→ /api/user/* → User Service (localhost:8082)
            │                      │
            │                      ├─→ MongoDB
            │                      └─→ Tenant Service (gRPC)
            │
            └─→ /api/tenant/* → Tenant Service (localhost:8083)
                                    │
                                    └─→ MongoDB
```

## Success Criteria

✅ All 5 terminals running without errors
✅ Health checks return 200 OK
✅ Can register/login via Gateway
✅ Can CRUD users via Gateway with token
✅ React UI loads at localhost:3000
✅ React UI can perform full CRUD on users
✅ All API calls in browser go through Gateway (verify in Network tab)
✅ X-Tenant-ID header injected by Gateway
✅ Token validation works across services

## Next Steps

After successful integration test:
1. Add more UI pages (Tenants, Settings)
2. Implement proper error handling in UI
3. Add loading states and notifications
4. Implement role-based access control
5. Add unit and integration tests
6. Setup CI/CD pipeline
