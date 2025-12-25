# Architecture Documentation

## Overview

The User Service is built using **Clean Architecture** principles, ensuring separation of concerns, testability, and maintainability. It's designed to be a standalone microservice that can be integrated into any SaaS platform.

## Table of Contents

1. [Architecture Principles](#architecture-principles)
2. [Project Structure](#project-structure)
3. [Layer Responsibilities](#layer-responsibilities)
4. [Data Flow](#data-flow)
5. [Technology Stack](#technology-stack)
6. [Design Patterns](#design-patterns)
7. [Multi-Tenancy](#multi-tenancy)
8. [Security Architecture](#security-architecture)
9. [Scalability](#scalability)

## Architecture Principles

### Clean Architecture

The service follows Uncle Bob's Clean Architecture principles:

1. **Independence of Frameworks**: Business logic doesn't depend on frameworks
2. **Testability**: Business logic can be tested without external dependencies
3. **Independence of UI**: Multiple interfaces (HTTP, gRPC) without changing core logic
4. **Independence of Database**: Business logic is database-agnostic
5. **Independence of External Services**: Business logic doesn't depend on external APIs

### Dependency Rule

Dependencies point inward:
```
External → Handler → Service → Repository → Domain
```

- **Domain** has no dependencies
- **Repository** depends only on Domain
- **Service** depends on Domain and Repository interfaces
- **Handler** depends on Domain and Service
- **External** (main.go) wires everything together

## Project Structure

```
go-user-service/
├── cmd/
│   └── main.go                 # Application entry point
├── internal/
│   ├── domain/                 # Business entities and interfaces
│   │   ├── models.go          # User, UserPreferences entities
│   │   └── requests.go        # Request/Response DTOs
│   ├── service/               # Business logic layer
│   │   └── user_service.go
│   ├── repository/            # Data access layer
│   │   └── user_repository.go
│   ├── handler/               # HTTP handlers (Gin)
│   │   └── user_handler.go
│   ├── grpc/                  # gRPC service implementation
│   │   └── user_grpc.go
│   └── validation/            # Input validation utilities
│       ├── validators.go
│       └── validators_test.go
├── proto/                     # Protocol buffer definitions
├── docs/                      # Documentation
│   ├── diagrams/             # PlantUML diagrams
│   ├── DEPENDENCIES.md
│   ├── GDPR_COMPLIANCE.md
│   └── PRIVACY_BEST_PRACTICES.md
├── .github/
│   └── workflows/            # CI/CD workflows
├── Dockerfile
├── Makefile
├── go.mod
└── README.md
```

## Layer Responsibilities

### Domain Layer (`internal/domain/`)

**Purpose**: Define business entities and core business rules

**Responsibilities**:
- Define domain models (User, UserPreferences)
- Define request/response DTOs
- No external dependencies
- No framework-specific code

**Example**:
```go
type User struct {
    ID        primitive.ObjectID
    Email     string
    TenantID  string
    FirstName string
    LastName  string
    IsActive  bool
    CreatedAt time.Time
    UpdatedAt time.Time
}
```

### Repository Layer (`internal/repository/`)

**Purpose**: Abstract data access

**Responsibilities**:
- Implement data persistence
- Handle database queries
- Convert between database models and domain models
- Implement data access patterns

**Key Features**:
- MongoDB integration
- Text search indexes
- Compound indexes for multi-tenancy
- Parameterized queries (SQL injection prevention)
- Error handling and logging

**Example**:
```go
type UserRepository struct {
    collection *mongo.Collection
}

func (r *UserRepository) FindByID(ctx context.Context, id, tenantID string) (*domain.User, error)
func (r *UserRepository) Create(ctx context.Context, user *domain.User) error
func (r *UserRepository) Update(ctx context.Context, user *domain.User) error
```

### Service Layer (`internal/service/`)

**Purpose**: Implement business logic

**Responsibilities**:
- Orchestrate business operations
- Validate business rules
- Coordinate between repositories
- Handle transactions
- Audit logging

**Key Features**:
- Input validation
- Data sanitization
- Error handling
- Business rule enforcement
- Audit trail creation

**Example**:
```go
type UserService struct {
    userRepo *repository.UserRepository
    logger   *logger.Logger
}

func (s *UserService) CreateUser(ctx context.Context, req *domain.CreateUserRequest) (*domain.User, error) {
    // 1. Validate input
    // 2. Check business rules
    // 3. Call repository
    // 4. Log audit trail
    // 5. Return result
}
```

### Handler Layer (`internal/handler/`)

**Purpose**: Handle HTTP requests

**Responsibilities**:
- Parse HTTP requests
- Validate request format
- Call service layer
- Format HTTP responses
- Handle HTTP errors

**Key Features**:
- Gin framework integration
- Request binding and validation
- Error response formatting
- Tenant ID extraction from headers/JWT
- Pagination support

**Example**:
```go
type UserHandler struct {
    userService *service.UserService
    logger      *logger.Logger
}

func (h *UserHandler) CreateUser(c *gin.Context) {
    // 1. Bind request
    // 2. Extract context (tenant, user)
    // 3. Call service
    // 4. Return response
}
```

### gRPC Layer (`internal/grpc/`)

**Purpose**: Handle gRPC requests

**Responsibilities**:
- Implement gRPC service
- Convert protobuf messages to domain models
- Call service layer
- Return protobuf responses

**Key Features**:
- Protocol buffer integration
- gRPC error handling
- Context propagation
- Health check implementation

### Validation Layer (`internal/validation/`)

**Purpose**: Centralized input validation

**Responsibilities**:
- Validate email format
- Validate names (with unicode support)
- Validate phone numbers (E.164)
- Sanitize strings
- Validate IDs and tenant IDs

**Key Features**:
- Regex-based validation
- Unicode support
- XSS prevention
- Injection attack prevention

## Data Flow

### Create User Flow

```
HTTP Request → Handler → Service → Repository → MongoDB
                ↓          ↓          ↓
            Validate   Business   Data Access
            Request     Logic      + Indexes
                ↓          ↓          ↓
              DTO      Domain      Database
                       Model       Model
                         ↓          ↓
HTTP Response ← Handler ← Service ← Repository
```

**Detailed Steps**:

1. **HTTP Handler** receives POST /api/v1/users
2. **Handler** binds JSON to `CreateUserRequest`
3. **Handler** extracts tenant ID from JWT/header
4. **Service** validates email, name, phone
5. **Service** sanitizes input data
6. **Service** checks if user exists (FindByEmail)
7. **Service** creates User domain model
8. **Repository** inserts to MongoDB
9. **Repository** returns created user with ID
10. **Service** logs audit trail
11. **Handler** converts to UserResponse DTO
12. **Handler** returns 201 Created with user data

### Query User Flow (with caching)

```
HTTP Request → Handler → Service → Cache?
                                     ↓ Miss
                                  Repository → MongoDB
                                     ↓
HTTP Response ← Handler ← Service ← Cache Store
```

## Technology Stack

### Core

- **Language**: Go 1.25.5
- **Web Framework**: Gin (HTTP REST API)
- **RPC Framework**: gRPC + Protocol Buffers
- **Database**: MongoDB 4.4+
- **Cache**: Redis 6.0+ (optional)
- **Logging**: Uber Zap

### Dependencies

- **gin-gonic/gin**: HTTP web framework
- **mongo-driver**: MongoDB official driver
- **go.uber.org/zap**: Structured logging
- **google.golang.org/grpc**: gRPC framework
- **vhvcorp/go-shared**: Shared utilities (config, errors, logger, etc.)

### Tools

- **golangci-lint**: Code linting
- **go test**: Unit testing
- **Docker**: Containerization
- **GitHub Actions**: CI/CD

## Design Patterns

### Repository Pattern

**Purpose**: Abstract data access

**Benefits**:
- Testability (mock repositories)
- Database independence
- Clear separation of concerns

```go
type UserRepository interface {
    Create(ctx context.Context, user *domain.User) error
    FindByID(ctx context.Context, id, tenantID string) (*domain.User, error)
    FindByEmail(ctx context.Context, email, tenantID string) (*domain.User, error)
    List(ctx context.Context, tenantID string, page, pageSize int) ([]*domain.User, int64, error)
    Update(ctx context.Context, user *domain.User) error
    Delete(ctx context.Context, id, tenantID string) error
}
```

### Dependency Injection

**Purpose**: Loose coupling and testability

**Implementation**: Constructor injection

```go
func NewUserService(userRepo *repository.UserRepository, log *logger.Logger) *UserService {
    return &UserService{
        userRepo: userRepo,
        logger:   log,
    }
}
```

### DTO (Data Transfer Object)

**Purpose**: Decouple API from domain models

**Benefits**:
- API versioning
- Field filtering
- Security (hide sensitive fields)

```go
// Domain Model (internal)
type User struct {
    ID        primitive.ObjectID
    Password  string // Not exposed
    // ...
}

// API Response (external)
type UserResponse struct {
    ID        string `json:"id"`
    Email     string `json:"email"`
    // Password not included
}
```

### Soft Delete Pattern

**Purpose**: Data retention and audit trail

**Implementation**:
```go
func (r *UserRepository) Delete(ctx context.Context, id, tenantID string) error {
    return r.collection.UpdateOne(
        ctx,
        bson.M{"_id": objectID, "tenant_id": tenantID},
        bson.M{"$set": bson.M{
            "is_active":  false,
            "deleted_at": time.Now(),
        }},
    )
}
```

## Multi-Tenancy

### Strategy: Database-level isolation with tenant_id

**Implementation**:
- All collections have `tenant_id` field
- All queries include `tenant_id` filter
- Compound indexes: `{field, tenant_id}`
- Unique constraints include tenant_id

**Security**:
```go
// Always include tenant_id in queries
filter := bson.M{
    "email":     email,
    "tenant_id": tenantID, // From JWT or header
}
```

**Indexes**:
```go
// Unique email per tenant
{
    Keys: bson.D{
        {Key: "email", Value: 1},
        {Key: "tenant_id", Value: 1},
    },
    Options: options.Index().SetUnique(true),
}
```

## Security Architecture

### Input Validation

- **Layer 1**: Handler (format validation)
- **Layer 2**: Service (business validation)
- **Layer 3**: Repository (data constraints)

### SQL Injection Prevention

- Use parameterized queries (MongoDB driver handles this)
- Never concatenate user input into queries

### XSS Protection

- Sanitize all user input
- Remove control characters
- Escape HTML in responses

### Authentication & Authorization

- JWT token validation (handled by API Gateway)
- Tenant ID extracted from JWT
- User ID extracted from JWT
- Permission checks at handler level

### Data Protection

- **At Rest**: MongoDB encryption
- **In Transit**: TLS 1.3
- **Passwords**: bcrypt/argon2id (if stored)
- **PII**: Encryption for sensitive fields

### Audit Logging

All operations logged with:
- User ID
- Tenant ID
- Action performed
- Timestamp
- IP address
- Result (success/failure)

## Scalability

### Horizontal Scaling

- **Stateless Service**: No local state
- **Load Balancing**: Multiple instances behind load balancer
- **Session Management**: JWT tokens (no server-side sessions)

### Database Scaling

- **Read Replicas**: For read-heavy operations
- **Sharding**: By tenant_id
- **Indexes**: Optimized for common queries

### Caching Strategy

- **User Profiles**: Cache frequently accessed users (Redis)
- **Search Results**: Cache with TTL
- **Invalidation**: On update/delete

### Performance Optimization

- **Connection Pooling**: MongoDB connection pool
- **Pagination**: Limit result sets
- **Projection**: Select only needed fields
- **Indexes**: Compound indexes for multi-field queries

### Monitoring

- **Metrics**: Prometheus-compatible metrics
- **Logging**: Structured logging with Zap
- **Tracing**: OpenTelemetry support
- **Health Checks**: HTTP and gRPC health endpoints

## Error Handling

### Error Types

```go
errors.BadRequest()    // 400 - Invalid input
errors.Unauthorized()  // 401 - Not authenticated
errors.Forbidden()     // 403 - Not authorized
errors.NotFound()      // 404 - Resource not found
errors.Conflict()      // 409 - Duplicate resource
errors.Internal()      // 500 - Internal error
```

### Error Propagation

```
Repository → Service → Handler → HTTP Response
   ↓           ↓          ↓
Database    Business   HTTP
 Error       Error      Error
```

### Error Logging

- All errors logged with context
- Stack traces for internal errors
- Sensitive data masked in logs

## Testing Strategy

### Unit Tests

- Test domain logic in isolation
- Mock external dependencies
- Test validation functions
- Test business rules

### Integration Tests

- Test with real database (testcontainers)
- Test HTTP endpoints
- Test gRPC services

### Test Coverage Target

- Overall: >80%
- Business Logic: >90%
- Validation: 100%

## Deployment

### Container Strategy

- **Base Image**: golang:1.25.5-alpine (build)
- **Runtime Image**: alpine:latest
- **Size**: ~20MB
- **Security**: Non-root user

### Environment Configuration

- **Development**: .env file
- **Production**: Kubernetes secrets/ConfigMaps
- **Configuration**: Environment variables

### Health Checks

```go
// HTTP
GET /health     → 200 OK
GET /ready      → 200 OK (after dependencies ready)

// gRPC
grpc.health.v1.Health/Check
```

## Future Enhancements

1. **Event Sourcing**: Capture all state changes
2. **CQRS**: Separate read and write models
3. **GraphQL API**: Alternative to REST
4. **Real-time Updates**: WebSocket support
5. **Advanced Search**: Elasticsearch integration
6. **File Storage**: S3-compatible storage for avatars

---

**Last Updated**: December 2024  
**Version**: 1.0  
**Maintainer**: VHVCorp Development Team
