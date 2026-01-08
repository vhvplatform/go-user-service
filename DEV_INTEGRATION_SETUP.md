# Dev Integration Setup Guide

## Môi trường Dev Integration

Các service sẽ kết nối đến:
- **MongoDB Replica Set**: `192.168.1.203:27017,192.168.1.222:27017,192.168.1.223:27017`
- **Redis**: `192.168.1.203:6379`
- **Database**: `saas_framework`

## Cách sử dụng

### 1. Copy file .env.dev

```bash
# User Service
cd e:\NewFrameWork\go-user-service\server
copy .env.dev .env

# API Gateway
cd e:\NewFrameWork\go-api-gateway\server
copy .env.dev .env

# Auth Service
cd e:\NewFrameWork\go-auth-service\server
copy .env.dev .env

# Tenant Service
cd e:\NewFrameWork\go-tenant-service\server
copy .env.dev .env
```

### 2. Khởi động services

**Terminal 1 - Auth Service**:
```bash
cd e:\NewFrameWork\go-auth-service\server
go run cmd/main.go
```

**Terminal 2 - Tenant Service**:
```bash
cd e:\NewFrameWork\go-tenant-service\server
go run cmd/main.go
```

**Terminal 3 - User Service**:
```bash
cd e:\NewFrameWork\go-user-service\server
go run cmd/main.go
```

**Terminal 4 - API Gateway**:
```bash
cd e:\NewFrameWork\go-api-gateway\server
go run cmd/main.go
```

**Terminal 5 - Next.js Client**:
```bash
cd e:\NewFrameWork\go-user-service\client
pnpm dev
```

### 3. Kiểm tra kết nối

**Health Checks**:
```bash
# API Gateway
curl http://localhost:8080/health

# User Service (HTTP)
curl http://localhost:8082/health

# Auth Service (HTTP)
curl http://localhost:8081/health

# Tenant Service (HTTP)
curl http://localhost:8083/health
```

## Ports Summary

| Service | gRPC Port | HTTP Port |
|---------|-----------|-----------|
| Auth Service | 50051 | 8081 |
| User Service | 50052 | 8082 |
| Tenant Service | 50053 | 8083 |
| Notification Service | 50054 | 8084 |
| API Gateway | - | 8080 |
| Next.js Client | - | 3000 |
