# Server - Golang Backend

This directory contains the Golang backend microservice for the user service.

## Description

The User Service is a comprehensive microservice for managing user profiles, authentication data, and preferences in a multi-tenant SaaS environment. It provides robust CRUD operations, advanced search capabilities, and GDPR compliance features.

## Technologies

- Go 1.21+
- gRPC for service communication
- MongoDB for data persistence
- Redis for caching (optional)

## Project Structure

```
server/
├── cmd/                    # Application entry points
├── internal/               # Private application code
│   ├── domain/            # Domain models and business logic
│   ├── repository/        # Data access layer
│   ├── service/           # Business logic services
│   ├── handler/           # HTTP/gRPC handlers
│   ├── middleware/        # Middleware components
│   └── validation/        # Input validation
├── proto/                 # Protocol buffer definitions
├── go.mod                 # Go module definition
├── Dockerfile             # Container image definition
└── Makefile              # Build automation
```

## Getting Started

### Prerequisites

- Go 1.21 or higher
- MongoDB
- Make (for build automation)

### Installation

```bash
# Install dependencies
make deps

# Build the application
make build

# Run tests
make test

# Run the application
make run
```

### Configuration

Copy `.env.example` to `.env` and configure your environment variables.

## Development

For detailed development instructions, build commands, and API documentation, please refer to the main project documentation in the `docs/` directory at the root level.

## Windows Development

For Windows-specific development instructions, see `WINDOWS_COMPATIBILITY_SUMMARY.md` in the root directory.
