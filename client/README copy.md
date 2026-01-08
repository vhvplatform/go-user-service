# 🚀 VHV Platform - Microservices Dashboard

> Enterprise-grade **Vite + React** dashboard for microservices architecture with comprehensive security

[![CI/CD](https://github.com/vhvplatform/frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/vhvplatform/frontend/actions)
[![Security](https://github.com/vhvplatform/frontend/actions/workflows/security.yml/badge.svg)](https://github.com/vhvplatform/frontend/actions)
[![Version](https://img.shields.io/badge/version-3.3.0-blue.svg)](https://github.com/vhvplatform/frontend)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Development](#development)
- [Security](#security)
- [Contributing](#contributing)

## 🎯 Overview

VHV Platform is a modern, secure, and scalable frontend for microservices architecture built with **Vite**, **React**, TypeScript, and Tailwind CSS. Designed to integrate seamlessly with Go-based microservices including auth, user management, CRM, HRM, and LMS.

### Design Philosophy

- **Modern**: Vite 5, React 18, TypeScript 5, Tailwind v4
- **Professional**: Stripe, GitHub, Vercel, Linear-inspired design
- **Elegant**: Glassmorphism, micro-animations, smooth transitions
- **Secure**: Enterprise-grade security with encryption & validation
- **Responsive**: Desktop-first with mobile optimization

## ✨ Features

### Core Features
- ✅ **Microservices Integration** - Seamless API integration with Go services
- ✅ **Authentication & Authorization** - JWT-based auth with role management
- ✅ **User Management** - Complete CRUD operations
- ✅ **Security First** - 25+ security features implemented
- ✅ **Real-time Updates** - Live data synchronization
- ✅ **Responsive Design** - Works on all devices
- ✅ **Dark Mode** - System-aware theme switching

### Security Features
- 🔒 Token encryption & secure storage
- 🔒 Request signing & CSRF protection
- 🔒 XSS detection & input sanitization
- 🔒 Session management with timeout
- 🔒 Rate limiting & DDoS protection
- 🔒 HTTPS enforcement
- 🔒 Content Security Policy

### Developer Features
- 🛠️ TypeScript for type safety
- 🛠️ ESLint & Prettier for code quality
- 🛠️ Comprehensive testing
- 🛠️ GitHub Actions for CI/CD
- 🛠️ Detailed documentation

## 🔧 Tech Stack

### Frontend
- **Vite 5** - React framework
- **React 18.3** - UI library
- **TypeScript 5.8** - Type safety
- **Tailwind CSS v4** - Styling
- **Axios** - HTTP client

### UI Components
- **Radix UI** - Headless components
- **Motion** - Animations (Framer Motion)
- **Lucide React** - Icons
- **Recharts** - Charts & graphs
- **Sonner** - Toast notifications

### Development
- **Vitest** - Testing framework
- **ESLint** - Linting
- **Prettier** - Code formatting
- **GitHub Actions** - CI/CD

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0 (or pnpm >= 8.0.0)
- Git

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/vhvplatform/frontend.git
cd frontend

# 2. Install dependencies
npm install

# 3. Environment is already setup
# (.env file included with defaults)

# 4. Start development server
npm run dev
```

Application will open at: **http://localhost:5173**

### Default Configuration

The `.env` file comes with sensible defaults for local development:

```env
VITE_ENVIRONMENT=local
VITE_USE_MOCK_API=true
VITE_API_URL_LOCAL=http://localhost:8080/api/v1
```

**Development mode**: Uses mock data - no backend required  
**Production mode**: Set `VITE_USE_MOCK_API=false` to connect to real API

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:

### Getting Started
- 📖 **[Installation Guide](./docs/setup/INSTALL.md)** - Detailed installation steps
- 🚀 **[Quick Start](./docs/setup/QUICKSTART.md)** - Get up and running fast
- ✅ **[Setup Checklist](./docs/setup/SETUP_CHECKLIST.md)** - Complete setup guide

### Configuration
- ⚙️ **[Environment Setup](./docs/environment/COMPLETE_GUIDE.md)** - Environment variables
- 🔄 **[Migration Guide](./docs/migration/VITE_TO_NEXTJS.md)** - Vite to Next.js migration

### API Integration
- 🔌 **[API Integration](./docs/api/INTEGRATION_GUIDE.md)** - Connect to Go services
- 📝 **[Mock API](./docs/api/MOCK_API_README.md)** - Work with mock data

### Security
- 🔒 **[Security Best Practices](./docs/security/BEST_PRACTICES.md)** - Security guidelines
- 🛡️ **[Security Implementation](./docs/security/IMPLEMENTATION_GUIDE.md)** - Setup guide

### Deployment
- 🚢 **[Deployment Guide](./docs/deployment/GUIDE.md)** - Deploy to production

### More Documentation
- 📚 **[Full Documentation Index](./docs/README.md)** - All available docs

## 💻 Development

### Available Scripts

```bash
npm run dev          # Start development server (port 5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm test             # Run tests
```

### Project Structure

```
vhv-platform/
├── src/
│   ├── app/                 # React app directory
│   │   ├── components/      # React components
│   │   └── pages/          # Page components
│   ├── config/             # Configuration files
│   ├── services/           # API services
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   └── styles/             # Global styles
├── docs/                   # Documentation
│   ├── setup/             # Setup guides
│   ├── api/               # API documentation
│   ├── security/          # Security docs
│   └── ...                # More categories
├── .env                   # Environment variables
├── .env.example          # Environment template
└── README.md             # This file
```

### Environment Setup

Vite uses `.env` for environment configuration:

```env
# All client-side variables must have VITE_ prefix
VITE_ENVIRONMENT=local
VITE_USE_MOCK_API=true
VITE_API_URL_LOCAL=http://localhost:8080/api/v1

# For production
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-key
```

⚠️ **Important**: Changes to `.env` require server restart!

See [Environment Guide](./MIGRATION_VITE_COMPLETE.md) for more details.

## 🔒 Security

VHV Platform implements enterprise-grade security:

- ✅ **Secure Token Storage** - Encrypted localStorage
- ✅ **Request Signing** - HMAC-based request validation
- ✅ **CSRF Protection** - Token-based protection
- ✅ **XSS Prevention** - Input sanitization & CSP
- ✅ **Session Management** - Auto-logout & timeout
- ✅ **Rate Limiting** - DDoS protection
- ✅ **HTTPS Only** - Force secure connections

See [Security Documentation](./docs/security/BEST_PRACTICES.md) for detailed information.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🚢 Deployment

### Build for Production

```bash
npm run build
npm run preview
```

### Environment Variables for Production

Set these in your hosting platform:

```env
VITE_ENVIRONMENT=production
VITE_USE_MOCK_API=false
VITE_API_URL_LOCAL=https://api.yourcompany.com/v1
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-key
```

See [Deployment Guide](./docs/deployment/GUIDE.md) for platform-specific instructions.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md).

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [Git Workflow](./docs/development/GIT_WORKFLOW.md) for more details.

## 📝 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and updates.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration: Stripe, GitHub, Vercel, Linear
- UI Components: Radix UI, shadcn/ui
- Icons: Lucide
- Fonts: Inter

See [Attributions](./docs/reference/ATTRIBUTIONS.md) for complete list.

## 📞 Support

- **Documentation**: [/docs](./docs/README.md)
- **Issues**: [GitHub Issues](https://github.com/vhvplatform/frontend/issues)
- **Discussions**: [GitHub Discussions](https://github.com/vhvplatform/frontend/discussions)

## 🗺️ Roadmap

- [ ] GraphQL integration
- [ ] Real-time notifications with WebSocket
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Micro-frontend architecture

See [Project Status](./docs/reference/PROJECT_STATUS.md) for detailed roadmap.

---

**Built with ❤️ by VHV Platform Team**

[Website](https://vhvplatform.com) · [Documentation](./docs/README.md) · [GitHub](https://github.com/vhvplatform)