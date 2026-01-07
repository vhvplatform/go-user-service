# Architectural Conformance

This document describes the changes made to conform to the `go-infrastructure` architectural standards.

## Overview

The `go-user-service` has been updated to align with the hybrid multi-tenant SaaS architecture defined in the [`go-infrastructure`](https://github.com/vhvplatform/go-infrastructure) repository.

## Changes Made

### 1. Tenancy Middleware Integration

**Location**: `internal/middleware/tenancy.go`

Integrated the tenancy middleware pattern from `go-infrastructure` to enforce multi-tenant isolation. This middleware:

- Extracts and validates the `X-Tenant-ID` header from all incoming requests
- Ensures tenant ID is present for all tenant-aware routes
- Validates tenant ID format (3-128 characters)
- Stores tenant ID in both Gin context and standard Go context
- Provides helper functions for retrieving tenant ID:
  - `GetTenantID(c)` - Safe retrieval (returns empty string if not found)
  - `MustGetTenantID(c)` - Panics if not found (use after middleware)
  - `GetTenantIDFromContext(ctx)` - Retrieve from standard context

**Benefits**:
- Enforces strict tenant isolation at the application boundary
- Prevents cross-tenant data leakage
- Consistent tenant handling across all routes
- Compatible with go-infrastructure's hybrid routing patterns (subfolder and custom domain)

### 2. Handler Updates

**Location**: `internal/handler/user_handler.go`

Updated all handler functions to use the new middleware:

- Changed from `c.GetString("tenant_id")` to `middleware.MustGetTenantID(c)`
- Ensures type safety and proper tenant validation
- Handlers now guarantee tenant ID presence due to middleware

### 3. Router Configuration

**Location**: `cmd/main.go`

Updated router setup to apply tenancy middleware to all user routes:

```go
// Tenant-aware user routes
users := v1.Group("/users")
users.Use(middleware.TenancyMiddleware())
{
    users.POST("", userHandler.CreateUser)
    users.GET("", userHandler.ListUsers)
    // ... other routes
}
```

This ensures all user operations require a valid `X-Tenant-ID` header.

### 4. Dockerfile Standardization

**Location**: `Dockerfile`

Updated Dockerfile to match the single-service pattern (non-monorepo structure):

**Before** (monorepo pattern):
```dockerfile
COPY go.work go.work
COPY pkg/go.mod pkg/go.sum pkg/
COPY services/user-service/go.mod services/user-service/go.sum services/user-service/
```

**After** (single-service pattern):
```dockerfile
COPY go.mod go.sum ./
COPY . .
```

This aligns with the extracted service architecture where each service is in its own repository.

## Architecture Alignment

### Multi-tenant Traffic Flow

The service now properly integrates with the go-infrastructure traffic routing patterns:

**Pattern A (Subfolder Routing)**:
```
Request: https://saas.com/tenant-123/api/users
    ↓
Nginx extracts tenant_id = "tenant-123"
    ↓
Injects X-Tenant-ID: tenant-123 header
    ↓
Routes to user-service with header
    ↓
TenancyMiddleware validates and extracts tenant ID
    ↓
Handler uses middleware.MustGetTenantID(c)
```

**Pattern B (Custom Domain Routing)**:
```
Request: https://customer.com/api/users
    ↓
Nginx calls tenant-mapper service
    ↓
Tenant-mapper returns X-Tenant-ID: tenant-456
    ↓
Nginx injects header and routes to user-service
    ↓
TenancyMiddleware validates and extracts tenant ID
    ↓
Handler uses middleware.MustGetTenantID(c)
```

### Security Benefits

1. **Tenant Isolation**: Middleware enforces tenant ID presence on all protected routes
2. **Input Validation**: Tenant ID format is validated (length, characters)
3. **Audit Trail**: Tenant ID is logged for all operations
4. **Type Safety**: MustGetTenantID panics if tenant ID is missing, preventing silent failures
5. **Context Propagation**: Tenant ID available throughout request lifecycle

## Testing

### Middleware Tests

Added comprehensive tests for the tenancy middleware:

**Location**: `internal/middleware/tenancy_test.go`

Tests cover:
- Valid tenant ID extraction
- Missing tenant ID handling (400 Bad Request)
- Invalid tenant ID format validation
- Minimum/maximum length validation
- Context propagation
- Helper function behavior

Run tests:
```bash
make test
# or
go test -v ./internal/middleware/...
```

### Integration with Existing Tests

The middleware change is backward compatible with existing tests as long as they provide the `X-Tenant-ID` header.

## API Changes

### Required Header

All tenant-aware endpoints now **require** the `X-Tenant-ID` header:

```bash
# Success
curl -H "X-Tenant-ID: tenant-123" http://localhost:8082/api/v1/users

# Error (400 Bad Request)
curl http://localhost:8082/api/v1/users
```

### Error Responses

**Missing Tenant ID**:
```json
{
  "error": "Missing tenant identifier",
  "message": "X-Tenant-ID header is required for all tenant operations",
  "code": "TENANT_ID_REQUIRED"
}
```

**Invalid Tenant ID**:
```json
{
  "error": "Invalid tenant identifier",
  "message": "X-Tenant-ID must be between 3 and 128 characters",
  "code": "INVALID_TENANT_ID"
}
```

## Deployment Considerations

### Environment Variables

No new environment variables required. The service continues to use existing configuration.

### Backward Compatibility

**Breaking Change**: All API requests must now include the `X-Tenant-ID` header.

If you're calling this service directly (not through the infrastructure ingress), you must update clients to include this header.

### Nginx/Ingress Configuration

The service is designed to work with the go-infrastructure Nginx configuration that automatically injects the `X-Tenant-ID` header based on URL patterns or custom domains.

## References

- [go-infrastructure Repository](https://github.com/vhvplatform/go-infrastructure)
- [Hybrid Multi-tenant Deployment Guide](https://github.com/vhvplatform/go-infrastructure/blob/main/docs/HYBRID_MULTITENANT_DEPLOYMENT.md)
- [Tenancy Middleware Documentation](https://github.com/vhvplatform/go-infrastructure/blob/main/services/middleware/README.md)
- [Traffic Flow Architecture](https://github.com/vhvplatform/go-infrastructure/blob/main/docs/TRAFFIC_FLOW_ARCHITECTURE.md)

## Migration Checklist

- [x] Integrate tenancy middleware
- [x] Update handlers to use middleware functions
- [x] Apply middleware to all tenant-aware routes
- [x] Update Dockerfile to single-service pattern
- [x] Add middleware tests
- [x] Update documentation

## Next Steps

1. **Update client applications** to include `X-Tenant-ID` header in all requests
2. **Deploy behind go-infrastructure ingress** for automatic header injection
3. **Configure monitoring** to track tenant-specific metrics
4. **Implement rate limiting** per tenant if needed
5. **Add tenant-specific logging** for better observability
