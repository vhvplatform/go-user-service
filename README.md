# go-user-service

> Part of the SaaS Framework - Extracted from monorepo
> 
> **Conforms to**: [go-infrastructure](https://github.com/vhvplatform/go-infrastructure) architectural standards

## Quick Start

### For New Clones (First Time Setup)
```bash
git clone https://github.com/vhvplatform/go-user-service.git
cd go-user-service
git checkout copilot/update-repository-structure
```

### For Existing Repositories (Switch to New Structure)
```bash
cd go-user-service
git fetch origin
git checkout copilot/update-repository-structure
git pull origin copilot/update-repository-structure
```

## Description

The User Service is a comprehensive microservice for managing user profiles, authentication data, and preferences in a multi-tenant SaaS environment. It provides robust CRUD operations, advanced search capabilities, and GDPR compliance features.

## Repository Structure

This repository follows a multi-platform architecture with the following structure:

```
go-user-service/
├── server/          # Golang backend microservice
├── client/          # ReactJS frontend application (coming soon)
├── flutter/         # Flutter mobile application (coming soon)
└── docs/            # Project documentation
```

### Directories

- **server/**: Contains the Golang backend microservice code, including API endpoints, business logic, and data access layers. See [server/README.md](server/README.md) for details.
- **client/**: ReactJS frontend application for web-based user interface (planned).
- **flutter/**: Flutter mobile application for iOS and Android (planned).
- **docs/**: Comprehensive project documentation including architecture, API specs, and development guides.

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

## Getting Started

### Cloning the Repository

**For new repositories:**
```bash
git clone https://github.com/vhvplatform/go-user-service.git
cd go-user-service
```

**For existing repositories (switching to new structure):**
```bash
cd go-user-service
git fetch origin
git checkout copilot/update-repository-structure
git pull origin copilot/update-repository-structure
```

### Quick Start

Navigate to the specific component you want to work with:

- **Backend Development**: See [server/README.md](server/README.md)
- **Frontend Development**: See [client/README.md](client/README.md)
- **Mobile Development**: See [flutter/README.md](flutter/README.md)

## Prerequisites

### Server (Golang Backend)
- Go 1.25.5+
- MongoDB 4.4+ (if applicable)
- Redis 6.0+ (if applicable)
- RabbitMQ 3.9+ (if applicable)

For detailed server setup, see [server/README.md](server/README.md).

### Client (ReactJS Frontend)
- Node.js 16+ (coming soon)
- npm or yarn (coming soon)

### Flutter (Mobile App)
- Flutter SDK 3.0+ (coming soon)
- Android Studio / Xcode (coming soon)

## Configuration

For backend configuration details, see [server/README.md](server/README.md).

Environment variables configuration example:

```bash
# Server Configuration
USER_SERVICE_PORT=50052              # gRPC port
USER_SERVICE_HTTP_PORT=8082          # HTTP port
ENVIRONMENT=development              # development|staging|production

# Database
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=saas_framework

# Redis (Optional)
REDIS_URL=redis://localhost:6379/0
REDIS_ENABLED=true
```

See [docs/DEPENDENCIES.md](docs/DEPENDENCIES.md) for a complete list of environment variables.

## Development

All development commands and instructions are now located in the respective component directories:

- **Server (Backend)**: See [server/README.md](server/README.md) for build, test, and run instructions
- **Client (Frontend)**: See [client/README.md](client/README.md) (coming soon)
- **Flutter (Mobile)**: See [flutter/README.md](flutter/README.md) (coming soon)

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

See [docs/ARCHITECTURAL_CONFORMANCE.md](docs/ARCHITECTURAL_CONFORMANCE.md) for detailed information.

### Clean Architecture Pattern
The backend service follows clean architecture principles with clear separation of concerns.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed architecture documentation and [docs/DESIGN_ANALYSIS_VI.md](docs/DESIGN_ANALYSIS_VI.md) for comprehensive design and analysis documentation in Vietnamese.

### Technology Stack
- **Backend**: Go 1.25.5, Gin (HTTP), gRPC, MongoDB, Redis
- **Frontend**: ReactJS (planned)
- **Mobile**: Flutter (planned)

See [server/README.md](server/README.md) for backend-specific architecture details.

## API Documentation

For detailed API documentation including HTTP endpoints, gRPC services, and Swagger UI access, see:
- [docs/API.md](docs/API.md) - Complete API documentation
- [server/README.md](server/README.md) - Backend API details

### Quick Example - Create User
```http
POST /api/v1/users
Content-Type: application/json
X-Tenant-ID: tenant123

{
  "email": "user@example.com",
  "tenant_id": "tenant123",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890"
}
```

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
