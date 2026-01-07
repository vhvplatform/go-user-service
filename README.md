# go-user-service

> Multi-platform User Service - Part of the VHV SaaS Platform

This repository contains the complete User Service implementation across multiple platforms:
- Backend API (Golang)
- Frontend Web Application (ReactJS)
- Mobile Application (Flutter)

## Repository Structure

```
├── server/         # Backend microservice (Golang)
│   ├── cmd/       # Application entry points
│   ├── internal/  # Internal packages
│   ├── proto/     # Protocol buffers
│   └── ...        # Go backend files
│
├── client/         # Frontend web application (ReactJS)
│   └── README.md  # Frontend documentation
│
├── flutter/        # Mobile application (Flutter)
│   └── README.md  # Mobile app documentation
│
└── docs/          # Project documentation
    ├── API.md
    ├── ARCHITECTURE.md
    ├── DESIGN_ANALYSIS_VI.md
    └── ...
```

## Quick Start

### Backend Server (Golang)

```bash
cd server
go mod download
go run cmd/main.go
```

For detailed backend setup and development instructions, see [server/README.md](server/README.md).

### Frontend Client (ReactJS)

```bash
cd client
npm install
npm start
```

For detailed frontend setup and development instructions, see [client/README.md](client/README.md).

### Mobile App (Flutter)

```bash
cd flutter
flutter pub get
flutter run
```

For detailed mobile app setup and development instructions, see [flutter/README.md](flutter/README.md).

## Documentation

All project documentation is located in the `/docs` directory:

- **[API.md](docs/API.md)** - API documentation and endpoints
- **[ARCHITECTURE.md](docs/architecture/ARCHITECTURE.md)** - System architecture overview
- **[DESIGN_ANALYSIS_VI.md](docs/architecture/DESIGN_ANALYSIS_VI.md)** - Design analysis (Vietnamese)
- **[ARCHITECTURAL_CONFORMANCE.md](docs/architecture/ARCHITECTURAL_CONFORMANCE.md)** - Architectural conformance
- **[GDPR_COMPLIANCE.md](docs/GDPR_COMPLIANCE.md)** - GDPR compliance information
- **[PRIVACY_BEST_PRACTICES.md](docs/PRIVACY_BEST_PRACTICES.md)** - Privacy best practices
- **[WINDOWS_DEVELOPMENT.md](docs/windows/WINDOWS_DEVELOPMENT.md)** - Windows development guide
- **[DEPENDENCIES.md](docs/DEPENDENCIES.md)** - Dependencies documentation
- **[CONTRIBUTING.md](docs/CONTRIBUTING.md)** - Contribution guidelines
- **[CHANGELOG.md](docs/CHANGELOG.md)** - Version history
- **[IMPLEMENTATION_NOTES.md](docs/IMPLEMENTATION_NOTES.md)** - Implementation notes

## Features

### User Management
- User CRUD operations
- Multi-tenant support
- Profile management
- User search and filtering

### Security & Compliance
- GDPR compliance
- Multi-tenant isolation
- Input validation and sanitization
- Audit logging

### Multi-Platform Support
- RESTful API (Golang backend)
- gRPC inter-service communication
- ReactJS web interface
- Flutter mobile application

## Prerequisites

### Backend
- Go 1.25.5+
- MongoDB 4.4+
- Redis 6.0+ (optional)

### Frontend
- Node.js 16+
- npm or yarn

### Mobile
- Flutter SDK 3.0+
- Android Studio (for Android)
- Xcode (for iOS, macOS only)

## Development

Each component has its own development workflow. Please refer to the README file in each directory for specific instructions:

- **Backend**: [server/README.md](server/README.md)
- **Frontend**: [client/README.md](client/README.md)
- **Mobile**: [flutter/README.md](flutter/README.md)

## Contributing

See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for contribution guidelines.

## Related Repositories

- [go-shared](https://github.com/vhvplatform/go-shared) - Shared Go libraries
- [go-infrastructure](https://github.com/vhvplatform/go-infrastructure) - Infrastructure standards
- [saas-framework-go](https://github.com/vhvplatform/saas-framework-go) - Original monorepo

## License

MIT License - see [LICENSE](LICENSE) for details

## Support

- Documentation: [Wiki](https://github.com/vhvplatform/go-user-service/wiki)
- Issues: [GitHub Issues](https://github.com/vhvplatform/go-user-service/issues)
- Discussions: [GitHub Discussions](https://github.com/vhvplatform/go-user-service/discussions)

## Checkout Commands

### If you already have the repository cloned:

```bash
# Switch to the new branch
git fetch origin
git checkout copilot/update-repository-structure
```

### If you're cloning for the first time:

```bash
# Clone the repository and checkout the new branch
git clone https://github.com/vhvplatform/go-user-service.git
cd go-user-service
git checkout copilot/update-repository-structure
```
