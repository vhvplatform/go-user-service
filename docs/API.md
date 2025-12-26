# API Documentation

## Overview

The User Service exposes two APIs:
1. **HTTP REST API** (Gin) - Port 8082
2. **gRPC API** - Port 50052

## Table of Contents

1. [Authentication](#authentication)
2. [HTTP REST API](#http-rest-api)
3. [gRPC API](#grpc-api)
4. [Error Responses](#error-responses)
5. [Rate Limiting](#rate-limiting)
6. [Examples](#examples)

## Authentication

All endpoints require authentication via JWT token (except health checks).

**Header:**
```
Authorization: Bearer <jwt_token>
X-Tenant-ID: <tenant_id>
```

The JWT token should contain:
```json
{
  "sub": "user_id",
  "tenant_id": "tenant_id",
  "email": "user@example.com",
  "roles": ["user"]
}
```

## HTTP REST API

Base URL: `http://localhost:8082`

### Health Checks

#### Check Service Health

```http
GET /health
```

**Response: 200 OK**
```json
{
  "status": "healthy"
}
```

#### Check Service Readiness

```http
GET /ready
```

**Response: 200 OK**
```json
{
  "status": "ready"
}
```

### Users

#### Create User

```http
POST /api/v1/users
Content-Type: application/json
Authorization: Bearer <jwt_token>
X-Tenant-ID: <tenant_id>

{
  "email": "john.doe@example.com",
  "tenant_id": "tenant123",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890"
}
```

**Response: 201 Created**
```json
{
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john.doe@example.com",
    "tenant_id": "tenant123",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "avatar_url": "",
    "is_active": true,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

**Validation Rules:**
- `email`: Required, valid email format, max 255 chars
- `tenant_id`: Required, alphanumeric with hyphens/underscores, max 50 chars
- `first_name`: Optional, 1-100 chars, unicode letters only
- `last_name`: Optional, 1-100 chars, unicode letters only
- `phone`: Optional, E.164 format (e.g., +1234567890)

**Error Responses:**
- `400 Bad Request`: Invalid input
- `409 Conflict`: User with email already exists
- `500 Internal Server Error`: Server error

#### Get User by ID

```http
GET /api/v1/users/:id
Authorization: Bearer <jwt_token>
X-Tenant-ID: <tenant_id>
```

**Example:**
```http
GET /api/v1/users/507f1f77bcf86cd799439011
```

**Response: 200 OK**
```json
{
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john.doe@example.com",
    "tenant_id": "tenant123",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "avatar_url": "https://example.com/avatars/john.jpg",
    "is_active": true,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid user ID format
- `404 Not Found`: User not found
- `500 Internal Server Error`: Server error

#### List Users

```http
GET /api/v1/users?page=1&page_size=20
Authorization: Bearer <jwt_token>
X-Tenant-ID: <tenant_id>
```

**Query Parameters:**
- `page`: Page number (default: 1, min: 1)
- `page_size`: Results per page (default: 20, min: 1, max: 100)

**Response: 200 OK**
```json
{
  "data": {
    "users": [
      {
        "id": "507f1f77bcf86cd799439011",
        "email": "john.doe@example.com",
        "tenant_id": "tenant123",
        "first_name": "John",
        "last_name": "Doe",
        "phone": "+1234567890",
        "avatar_url": "https://example.com/avatars/john.jpg",
        "is_active": true,
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
      }
    ],
    "total": 150,
    "page": 1,
    "page_size": 20
  }
}
```

**Pagination Info:**
- `total`: Total number of users
- `page`: Current page number
- `page_size`: Number of results per page
- Total pages: `Math.ceil(total / page_size)`

#### Search Users

```http
GET /api/v1/users/search?q=john&page=1&page_size=20
Authorization: Bearer <jwt_token>
X-Tenant-ID: <tenant_id>
```

**Query Parameters:**
- `q`: Search query (required, min 2 chars, max 100 chars)
- `page`: Page number (default: 1)
- `page_size`: Results per page (default: 20, max: 100)

**Search Behavior:**
- Full-text search across `first_name`, `last_name`, `email`
- Case-insensitive
- Word stemming
- Phrase matching with quotes (e.g., `q="John Doe"`)

**Response: 200 OK**
```json
{
  "data": {
    "users": [
      {
        "id": "507f1f77bcf86cd799439011",
        "email": "john.doe@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "tenant_id": "tenant123",
        "is_active": true
      }
    ],
    "total": 5,
    "page": 1,
    "page_size": 20
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid or missing query parameter
- `500 Internal Server Error`: Server error

#### Update User

```http
PUT /api/v1/users/:id
Content-Type: application/json
Authorization: Bearer <jwt_token>
X-Tenant-ID: <tenant_id>

{
  "first_name": "Jane",
  "last_name": "Smith",
  "phone": "+1987654321",
  "avatar_url": "https://example.com/avatars/jane.jpg"
}
```

**Request Body:**
- All fields are optional
- Only provided fields will be updated
- Empty strings are ignored

**Response: 200 OK**
```json
{
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john.doe@example.com",
    "tenant_id": "tenant123",
    "first_name": "Jane",
    "last_name": "Smith",
    "phone": "+1987654321",
    "avatar_url": "https://example.com/avatars/jane.jpg",
    "is_active": true,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T12:45:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input
- `404 Not Found`: User not found
- `500 Internal Server Error`: Server error

#### Delete User (Soft Delete)

```http
DELETE /api/v1/users/:id
Authorization: Bearer <jwt_token>
X-Tenant-ID: <tenant_id>
```

**Behavior:**
- Soft delete: Sets `is_active = false` and `deleted_at = now()`
- User data is retained for audit purposes
- User cannot log in after deletion
- Email becomes available for new registrations

**Response: 200 OK**
```json
{
  "message": "User deleted successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid user ID
- `404 Not Found`: User not found
- `500 Internal Server Error`: Server error

## gRPC API

Service: `UserService`  
Port: `50052`

### Proto Definition

```protobuf
syntax = "proto3";

package user;

service UserService {
  rpc GetUser(GetUserRequest) returns (GetUserResponse);
  rpc ListUsers(ListUsersRequest) returns (ListUsersResponse);
  rpc SearchUsers(SearchUsersRequest) returns (SearchUsersResponse);
  rpc UpdateUser(UpdateUserRequest) returns (UpdateUserResponse);
  rpc DeleteUser(DeleteUserRequest) returns (DeleteUserResponse);
}

message User {
  string id = 1;
  string email = 2;
  string tenant_id = 3;
  string first_name = 4;
  string last_name = 5;
  string phone = 6;
  string avatar_url = 7;
  bool is_active = 8;
  string created_at = 9;
  string updated_at = 10;
}

message GetUserRequest {
  string user_id = 1;
  string tenant_id = 2;
}

message GetUserResponse {
  User user = 1;
}

message ListUsersRequest {
  string tenant_id = 1;
  int32 page = 2;
  int32 page_size = 3;
}

message ListUsersResponse {
  repeated User users = 1;
  int32 total = 2;
  int32 page = 3;
  int32 page_size = 4;
}
```

### Example Usage (Go)

```go
import (
    "context"
    "google.golang.org/grpc"
    pb "github.com/vhvplatform/go-user-service/proto"
)

// Connect to service
conn, err := grpc.Dial("localhost:50052", grpc.WithInsecure())
if err != nil {
    log.Fatal(err)
}
defer conn.Close()

client := pb.NewUserServiceClient(conn)

// Get user
resp, err := client.GetUser(context.Background(), &pb.GetUserRequest{
    UserId:   "507f1f77bcf86cd799439011",
    TenantId: "tenant123",
})
if err != nil {
    log.Fatal(err)
}

fmt.Printf("User: %+v\n", resp.User)
```

### Example Usage (Node.js)

```javascript
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('user.proto');
const proto = grpc.loadPackageDefinition(packageDefinition).user;

const client = new proto.UserService(
  'localhost:50052',
  grpc.credentials.createInsecure()
);

client.GetUser({
  user_id: '507f1f77bcf86cd799439011',
  tenant_id: 'tenant123'
}, (err, response) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('User:', response.user);
});
```

## Error Responses

### HTTP Error Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "status_code": 400
  }
}
```

### Common Error Codes

| HTTP Status | Code | Description |
|-------------|------|-------------|
| 400 | BAD_REQUEST | Invalid input or malformed request |
| 401 | UNAUTHORIZED | Missing or invalid authentication token |
| 403 | FORBIDDEN | Insufficient permissions |
| 404 | NOT_FOUND | Resource not found |
| 409 | CONFLICT | Resource already exists (duplicate) |
| 429 | TOO_MANY_REQUESTS | Rate limit exceeded |
| 500 | INTERNAL_ERROR | Internal server error |

### gRPC Error Codes

| Code | Description |
|------|-------------|
| OK | Success |
| INVALID_ARGUMENT | Invalid request parameters |
| NOT_FOUND | Resource not found |
| ALREADY_EXISTS | Resource already exists |
| UNAUTHENTICATED | Missing or invalid authentication |
| PERMISSION_DENIED | Insufficient permissions |
| INTERNAL | Internal server error |

## Rate Limiting

**Limits:**
- 100 requests per minute per IP
- 1000 requests per hour per user

**Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1609459200
```

**Response when limit exceeded:**
```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60

{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again in 60 seconds.",
    "status_code": 429
  }
}
```

## Examples

### cURL Examples

#### Create User

```bash
curl -X POST http://localhost:8082/api/v1/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Tenant-ID: tenant123" \
  -d '{
    "email": "john.doe@example.com",
    "tenant_id": "tenant123",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890"
  }'
```

#### Get User

```bash
curl http://localhost:8082/api/v1/users/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Tenant-ID: tenant123"
```

#### List Users

```bash
curl "http://localhost:8082/api/v1/users?page=1&page_size=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Tenant-ID: tenant123"
```

#### Search Users

```bash
curl "http://localhost:8082/api/v1/users/search?q=john&page=1&page_size=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Tenant-ID: tenant123"
```

#### Update User

```bash
curl -X PUT http://localhost:8082/api/v1/users/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Tenant-ID: tenant123" \
  -d '{
    "first_name": "Jane",
    "phone": "+1987654321"
  }'
```

#### Delete User

```bash
curl -X DELETE http://localhost:8082/api/v1/users/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Tenant-ID: tenant123"
```

### Postman Collection

Import this collection into Postman:

```json
{
  "info": {
    "name": "User Service API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:8082"
    },
    {
      "key": "jwt_token",
      "value": "YOUR_JWT_TOKEN"
    },
    {
      "key": "tenant_id",
      "value": "tenant123"
    }
  ],
  "item": [
    {
      "name": "Create User",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{jwt_token}}"
          },
          {
            "key": "X-Tenant-ID",
            "value": "{{tenant_id}}"
          }
        ],
        "url": "{{baseUrl}}/api/v1/users",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"john.doe@example.com\",\n  \"tenant_id\": \"{{tenant_id}}\",\n  \"first_name\": \"John\",\n  \"last_name\": \"Doe\"\n}"
        }
      }
    }
  ]
}
```

## Versioning

API Version: **v1**

URL format: `/api/v1/...`

Future versions will be released as `/api/v2/...`, maintaining backward compatibility.

## Support

For API support or questions:
- Email: api-support@vhvplatform.com
- Documentation: https://docs.vhvplatform.com/user-service
- GitHub Issues: https://github.com/vhvplatform/go-user-service/issues

---

**Last Updated**: December 2024  
**API Version**: 1.0
