# User Service Dependencies

## Shared Packages (from saas-shared-go)

```go
require (
    github.com/longvhv/saas-shared-go/config
    github.com/longvhv/saas-shared-go/logger
    github.com/longvhv/saas-shared-go/mongodb
    github.com/longvhv/saas-shared-go/redis
    github.com/longvhv/saas-shared-go/errors
    github.com/longvhv/saas-shared-go/middleware
    github.com/longvhv/saas-shared-go/response
    github.com/longvhv/saas-shared-go/validation
    github.com/longvhv/saas-shared-go/tenant
)
```

## External Dependencies

### Infrastructure
- **MongoDB**: User profiles, preferences
  - Collections: `users`, `user_profiles`, `user_preferences`
- **Redis**: User session cache
  - Keys: `user:*`, `profile:*`

### Third-party Libraries
```go
require (
    github.com/gin-gonic/gin v1.10.0
    google.golang.org/grpc v1.69.2
    go.mongodb.org/mongo-driver v1.17.3
    go.uber.org/zap v1.27.0
)
```

## Inter-service Communication

### Services Called by User Service
- **Tenant Service** (gRPC: 50053): Tenant validation
- **Notification Service** (gRPC: 50054): User notifications

### Services Calling User Service
- **API Gateway**: User CRUD operations
- **Auth Service**: User creation after registration

## Environment Variables

```bash
# Server
USER_SERVICE_PORT=50052
USER_SERVICE_HTTP_PORT=8082

# Database
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=saas_framework

# Redis
REDIS_URL=redis://localhost:6379/0

# Service URLs
TENANT_SERVICE_URL=localhost:50053
NOTIFICATION_SERVICE_URL=localhost:50054

# Logging
LOG_LEVEL=info
```

## Database Schema

### Collections

#### users
```json
{
  "_id": "ObjectId",
  "email": "string (indexed)",
  "tenant_id": "string (indexed)",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

#### user_profiles
```json
{
  "_id": "ObjectId",
  "user_id": "string (indexed)",
  "first_name": "string",
  "last_name": "string",
  "phone": "string",
  "avatar_url": "string",
  "bio": "string",
  "updated_at": "timestamp"
}
```

## Resource Requirements

### Production
- CPU: 1 core
- Memory: 1GB
- Replicas: 2
