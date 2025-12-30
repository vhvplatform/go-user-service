# go-user-service

> Part of the SaaS Framework - Extracted from monorepo
> 
> **Conforms to**: [go-infrastructure](https://github.com/vhvplatform/go-infrastructure) architectural standards

## Description

The User Service is a comprehensive microservice for managing user profiles, authentication data, and preferences in a multi-tenant SaaS environment. It provides robust CRUD operations, advanced search capabilities, and GDPR compliance features.

## Features

### User Management
- **User CRUD Operations**: Create, read, update, and delete user profiles
- **Multi-tenant Support**: Isolated user data per tenant with tenant-scoped operations
- **Profile Management**: First name, last name, email, phone, and avatar
- **User Status**: Active/inactive user status tracking
- **Email Uniqueness**: Enforced unique email per tenant

### User Search & Filtering
- **Full-Text Search**: Search users by name, email using MongoDB text indexes
- **Pagination**: Efficient pagination for listing and search results
- **Advanced Filtering**: Filter users by status, tenant, and custom criteria

### User Preferences
- **Customizable Settings**: Language, timezone, theme preferences
- **Flexible Configuration**: Store arbitrary settings as key-value pairs
- **Per-user Preferences**: Isolated preference management per user

### GDPR Compliance
- **Right to Access**: Users can retrieve all their personal data
- **Right to Erasure**: Soft delete with data anonymization capabilities
- **Data Portability**: Export user data in machine-readable format
- **Consent Management**: Track and manage user consent for data processing
- **Data Minimization**: Store only necessary user information
- **Privacy by Design**: Built with privacy-first architecture

### Security & Privacy
- **Input Validation**: Comprehensive validation using go-playground/validator
- **SQL Injection Prevention**: MongoDB parameterized queries
- **XSS Protection**: Input sanitization for all user inputs
- **Audit Logging**: Comprehensive audit trail for all user operations
- **Secure Data Storage**: Sensitive data encryption at rest
- **Multi-tenant Isolation**: Strict tenant boundary enforcement with X-Tenant-ID header validation

## Architecture

This service conforms to the [go-infrastructure](https://github.com/vhvplatform/go-infrastructure) architectural standards for hybrid multi-tenant SaaS applications.

### Tenancy Middleware

All API endpoints require the `X-Tenant-ID` header for tenant isolation:

```bash
curl -H "X-Tenant-ID: tenant-123" http://localhost:8082/api/v1/users
```

The service integrates with go-infrastructure's hybrid routing patterns:
- **Pattern A**: Subfolder routing (`saas.com/{tenant}/api/*`)
- **Pattern B**: Custom domain routing (`customer.com/api/*`)

See [ARCHITECTURAL_CONFORMANCE.md](docs/ARCHITECTURAL_CONFORMANCE.md) for detailed information.

## Prerequisites

- Go 1.25.5+
- MongoDB 4.4+ (if applicable)
- Redis 6.0+ (if applicable)
- RabbitMQ 3.9+ (if applicable)

### Windows Development Prerequisites

- **Go 1.25.5+**: Download from [golang.org](https://golang.org/dl/)
- **Git for Windows**: Download from [git-scm.com](https://git-scm.com/download/win)
- **Make (Optional)**: Use [Chocolatey](https://chocolatey.org/) to install: `choco install make`
  - Alternatively, use the provided `.bat` scripts instead of Makefile commands
- **Docker Desktop** (Optional for containerized services): Download from [docker.com](https://www.docker.com/products/docker-desktop)

## Installation

### Linux/macOS

```bash
# Clone the repository
git clone https://github.com/vhvplatform/go-user-service.git
cd go-user-service

# Install dependencies
go mod download
```

### Windows

```cmd
REM Clone the repository
git clone https://github.com/vhvplatform/go-user-service.git
cd go-user-service

REM Install dependencies
deps.bat
```

## Configuration

Environment variables configuration:

```bash
# Server Configuration
USER_SERVICE_PORT=50052              # gRPC port
USER_SERVICE_HTTP_PORT=8082          # HTTP port
ENVIRONMENT=development              # development|staging|production

# Database
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=saas_framework
MONGODB_MAX_POOL_SIZE=100
MONGODB_MIN_POOL_SIZE=10

# Redis (Optional)
REDIS_URL=redis://localhost:6379/0
REDIS_ENABLED=true

# Logging
LOG_LEVEL=info                       # debug|info|warn|error

# Service Discovery
TENANT_SERVICE_URL=localhost:50053
NOTIFICATION_SERVICE_URL=localhost:50054
```

Copy the example environment file and update with your values:

**Linux/macOS:**
```bash
cp .env.example .env
```

**Windows:**
```cmd
copy .env.example .env
```

See [DEPENDENCIES.md](docs/DEPENDENCIES.md) for a complete list of environment variables.

## Development

### Running Locally

**Linux/macOS:**
```bash
# Run the service
make run

# Or with go run
go run cmd/main.go
```

**Windows:**
```cmd
REM Run the service
run.bat

REM Or with go run
go run cmd\main.go
```

### Running with Docker

```bash
# Build and run (works on all platforms)
make docker-build
make docker-run
```

### Running Tests

**Linux/macOS:**
```bash
# Run all tests
make test

# Run with coverage
make test-coverage
```

**Windows:**
```cmd
REM Run all tests
test.bat

REM Run with coverage
test.bat coverage
```

### Linting

**Linux/macOS:**
```bash
# Run linters
make lint

# Format code
make fmt
```

**Windows:**
```cmd
REM Run linters
lint.bat

REM Format code
fmt.bat
```

### Building

**Linux/macOS:**
```bash
# Build the service
make build
```

**Windows:**
```cmd
REM Build the service
build.bat
```

### Installing Development Tools

**Linux/macOS:**
```bash
make install-tools
```

**Windows:**
```cmd
install-tools.bat
```

### Cleaning Build Artifacts

**Linux/macOS:**
```bash
make clean
```

**Windows:**
```cmd
clean.bat
```

## Windows Development

For comprehensive Windows development instructions, including troubleshooting and IDE setup, see the [Windows Development Guide](docs/WINDOWS_DEVELOPMENT.md).

## API Documentation

See [docs/API.md](docs/API.md) for API documentation.

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for deployment instructions.

## Architecture

### Clean Architecture Pattern
The service follows clean architecture principles with clear separation of concerns:

```
cmd/           # Application entry points
internal/
  ├── domain/      # Business entities and interfaces
  ├── service/     # Business logic layer
  ├── repository/  # Data access layer
  ├── handler/     # HTTP request handlers
  └── grpc/        # gRPC service implementation
```

### Technology Stack
- **Language**: Go 1.25.5
- **Web Framework**: Gin (HTTP) + gRPC
- **Database**: MongoDB 4.4+
- **Cache**: Redis 6.0+ (optional)
- **Logging**: Uber Zap
- **Validation**: go-playground/validator

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed architecture documentation.
See [docs/DESIGN_ANALYSIS_VI.md](docs/DESIGN_ANALYSIS_VI.md) for comprehensive design and analysis documentation in Vietnamese.
See [docs/diagrams/](docs/diagrams/) for PlantUML diagrams.

## API Documentation

### HTTP Endpoints

#### Create User
```http
POST /api/v1/users
Content-Type: application/json

{
  "email": "user@example.com",
  "tenant_id": "tenant123",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890"
}
```

#### Get User
```http
GET /api/v1/users/:id
X-Tenant-ID: tenant123
```

#### List Users
```http
GET /api/v1/users?page=1&page_size=20
X-Tenant-ID: tenant123
```

#### Search Users
```http
GET /api/v1/users/search?query=john&page=1&page_size=20
X-Tenant-ID: tenant123
```

#### Update User
```http
PUT /api/v1/users/:id
X-Tenant-ID: tenant123
Content-Type: application/json

{
  "first_name": "Jane",
  "last_name": "Smith",
  "phone": "+1987654321",
  "avatar_url": "https://example.com/avatar.jpg"
}
```

#### Delete User (Soft Delete)
```http
DELETE /api/v1/users/:id
X-Tenant-ID: tenant123
```

### gRPC Services

The service exposes gRPC endpoints for inter-service communication:
- `UserService.CreateUser`
- `UserService.GetUser`
- `UserService.ListUsers`
- `UserService.SearchUsers`
- `UserService.UpdateUser`
- `UserService.DeleteUser`

See [proto/](proto/) for complete protobuf definitions.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## Related Repositories

- [go-shared](https://github.com/vhvplatform/go-shared) - Shared Go libraries
- [saas-framework-go](https://github.com/vhvplatform/saas-framework-go) - Original monorepo

## License

MIT License - see [LICENSE](LICENSE) for details

## Support

- Documentation: [Wiki](https://github.com/vhvplatform/go-user-service/wiki)
- Issues: [GitHub Issues](https://github.com/vhvplatform/go-user-service/issues)
- Discussions: [GitHub Discussions](https://github.com/vhvplatform/go-user-service/discussions)
