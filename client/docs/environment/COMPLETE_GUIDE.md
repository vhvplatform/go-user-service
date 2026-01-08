# 🌍 Environment Configuration - Complete Guide

> Comprehensive guide for environment setup in VHV Platform (Next.js)

**Version**: 3.3.0  
**Framework**: Next.js 15  
**Last Updated**: January 2026  

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Environment Types](#environment-types)
4. [Environment Variables](#environment-variables)
5. [Configuration Files](#configuration-files)
6. [Best Practices](#best-practices)
7. [Security](#security)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

### Architecture

VHV Platform supports **4 environment configurations**:

```
┌─────────────────────────────────────────────┐
│  LOCAL (Development)                        │
│  ↓ Individual testing                       │
│                                             │
│  DEV (Shared Development)                   │
│  ↓ Team integration                         │
│                                             │
│  STAGING (UAT)                              │
│  ↓ User acceptance testing                  │
│                                             │
│  PRODUCTION (Live)                          │
│  ✓ Real users                               │
└─────────────────────────────────────────────┘
```

### Next.js Environment Files

| File | Environment | Committed? | Usage |
|------|-------------|------------|-------|
| `.env.local.example` | Template | ✅ Yes | Template for all environments |
| `.env.local` | Local dev | ❌ No | Your local configuration |
| `.env.development` | Dev | ❌ No | Development shared config |
| `.env.staging` | Staging | ❌ No | Staging configuration |
| `.env.production` | Production | ❌ No | Production configuration |

**⚠️ CRITICAL**: Never commit actual `.env.*` files (except `.example` files)!

---

## ⚡ Quick Start

### 1. Setup Local Development

```bash
# Copy example file
cp .env.local.example .env.local

# Edit with your configuration
nano .env.local
```

### 2. Minimum Required Configuration

Update these **REQUIRED** variables in `.env.local`:

```bash
# Environment
NEXT_PUBLIC_ENVIRONMENT=local

# Mock API (for development without backend)
NEXT_PUBLIC_USE_MOCK_API=true

# API Configuration (when connecting to real backend)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

### 3. Verify and Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# ⚠️ Important: Restart server after changing .env.local!
```

Application opens at: **http://localhost:3000**

---

## 🏗️ Environment Types

### 1. LOCAL (Development)

**Purpose**: Individual developer testing on localhost

**Configuration**:
```bash
NEXT_PUBLIC_ENVIRONMENT=local
NEXT_PUBLIC_USE_MOCK_API=true
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_ENABLE_DEBUG=true
```

**Characteristics**:
- ✅ Full debug mode enabled
- ✅ Mock APIs available
- ✅ Local database
- ✅ Hot reload
- ✅ Source maps
- ❌ No SSL required
- ❌ No monitoring

**Use Cases**:
- Feature development
- Bug fixing
- Experimentation
- Unit testing

**URL**: `http://localhost:3000`

---

### 2. DEV (Development Shared)

**Purpose**: Team integration testing

**Configuration**:
```bash
NEXT_PUBLIC_ENVIRONMENT=dev
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_API_BASE_URL=https://dev-api.vhvplatform.com/api/v1
NEXT_PUBLIC_ENABLE_DEBUG=true
```

**Characteristics**:
- ✅ Real backend services
- ✅ Shared database
- ✅ Basic monitoring
- ✅ Debug enabled
- ✅ SSL enabled
- ⚠️ Test data only
- ❌ No production data

**Use Cases**:
- Integration testing
- API testing
- Team collaboration
- Feature integration

**URL**: `https://dev.vhvplatform.com`

---

### 3. STAGING (UAT)

**Purpose**: User acceptance testing before production

**Configuration**:
```bash
NEXT_PUBLIC_ENVIRONMENT=staging
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_API_BASE_URL=https://staging-api.vhvplatform.com/api/v1
NEXT_PUBLIC_ENABLE_DEBUG=false
```

**Characteristics**:
- ✅ Production-like environment
- ✅ Real backend services
- ✅ Full monitoring
- ✅ SSL enforced
- ⚠️ Sample production data
- ❌ Limited debug

**Use Cases**:
- UAT testing
- Client demonstrations
- Pre-deployment validation
- Performance testing

**URL**: `https://staging.vhvplatform.com`

---

### 4. PRODUCTION (Live)

**Purpose**: Live deployment with real users

**Configuration**:
```bash
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_API_BASE_URL=https://api.vhvplatform.com/api/v1
NEXT_PUBLIC_ENABLE_DEBUG=false
```

**Characteristics**:
- ✅ Production environment
- ✅ Real data
- ✅ Full monitoring & logging
- ✅ SSL enforced
- ✅ Rate limiting
- ✅ Error tracking
- ❌ No debug mode

**Use Cases**:
- Live production
- Real users
- Business operations

**URL**: `https://app.vhvplatform.com`

---

## 🔧 Environment Variables

### Core Variables

#### Environment Selection
```bash
NEXT_PUBLIC_ENVIRONMENT=local
# Options: local | dev | staging | production
```

#### API Configuration
```bash
# API URLs for each environment
NEXT_PUBLIC_API_URL_LOCAL=http://localhost:8080/api/v1
NEXT_PUBLIC_API_URL_DEV=https://dev-api.vhvplatform.com/api/v1
NEXT_PUBLIC_API_URL_STAGING=https://staging-api.vhvplatform.com/api/v1
NEXT_PUBLIC_API_URL_PRODUCTION=https://api.vhvplatform.com/api/v1

# Base URL (auto-selected based on environment)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_API_TIMEOUT=30000
```

#### Mock API Mode
```bash
NEXT_PUBLIC_USE_MOCK_API=true
# true = Use mock data (no backend needed)
# false = Connect to real API
```

#### Microservices URLs
```bash
NEXT_PUBLIC_USER_SERVICE_URL=http://localhost:8081/api/v1
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:8082/api/v1
NEXT_PUBLIC_FILE_SERVICE_URL=http://localhost:8083/api/v1
NEXT_PUBLIC_GO_USER_SERVICE_URL=http://localhost:8080
```

#### Supabase Configuration (Optional)
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

#### Application Info
```bash
NEXT_PUBLIC_APP_NAME=VHV Platform
NEXT_PUBLIC_APP_VERSION=3.3.0
NEXT_PUBLIC_APP_ENV=development
```

#### Tenant Configuration
```bash
NEXT_PUBLIC_TENANT_ID=tenant-123
NEXT_PUBLIC_TENANT_NAME=VHV Platform
```

#### Feature Flags
```bash
NEXT_PUBLIC_FEATURE_ANALYTICS=true
NEXT_PUBLIC_FEATURE_NOTIFICATIONS=true
NEXT_PUBLIC_FEATURE_REPORTS=true
NEXT_PUBLIC_FEATURE_TEAMS=true
```

#### Debug & Logging
```bash
NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_LOG_LEVEL=info
# Options: debug | info | warn | error

NEXT_PUBLIC_ENABLE_DEBUG=true
```

#### Security
```bash
NEXT_PUBLIC_FORCE_HTTPS=true
NEXT_PUBLIC_SESSION_TIMEOUT=3600
NEXT_PUBLIC_ENABLE_REQUEST_SIGNING=true
NEXT_PUBLIC_ENABLE_ERROR_REPORTING=true
NEXT_PUBLIC_CSP_ENABLED=true
```

### Server-Side Only Variables

**⚠️ NO `NEXT_PUBLIC_` prefix - These are NOT exposed to client:**

```bash
# Database (server-side only)
DATABASE_URL=

# API Keys (NEVER use NEXT_PUBLIC_ for secrets!)
API_SECRET_KEY=
ENCRYPTION_KEY=
```

---

## 📁 Configuration Files

### `/src/config/nextEnv.ts`

Helper functions for accessing environment variables:

```typescript
import { getEnv, getEnvNumber, getEnvBoolean } from '@/config/nextEnv';

// String values
const apiUrl = getEnv('NEXT_PUBLIC_API_BASE_URL');

// Number values
const timeout = getEnvNumber('NEXT_PUBLIC_API_TIMEOUT', 30000);

// Boolean values
const useMock = getEnvBoolean('NEXT_PUBLIC_USE_MOCK_API', true);
```

### `/src/config/apiConfig.ts`

Centralized API configuration:

```typescript
import { apiConfig } from '@/config/apiConfig';

// Get current environment API URL
const apiUrl = apiConfig.getApiUrl();

// Check if using mock mode
const isMock = apiConfig.isMockMode();
```

---

## ✅ Best Practices

### 1. Never Hardcode Configuration

**❌ DON'T:**
```typescript
const apiUrl = 'https://api.vhvplatform.com';  // ❌ Hardcoded
const tenantId = 'tenant-123';                  // ❌ Hardcoded
```

**✅ DO:**
```typescript
import { getEnv } from '@/config/nextEnv';

const apiUrl = getEnv('NEXT_PUBLIC_API_BASE_URL');  // ✅ From environment
const tenantId = getEnv('NEXT_PUBLIC_TENANT_ID');   // ✅ From environment
```

### 2. Use Type-Safe Helpers

```typescript
// ✅ Type-safe environment access
import { getEnv, getEnvNumber, getEnvBoolean } from '@/config/nextEnv';

const apiUrl = getEnv('NEXT_PUBLIC_API_BASE_URL');        // string
const timeout = getEnvNumber('NEXT_PUBLIC_API_TIMEOUT');  // number
const useMock = getEnvBoolean('NEXT_PUBLIC_USE_MOCK_API'); // boolean
```

### 3. Provide Fallback Values

```typescript
// ✅ Always provide sensible defaults
const timeout = getEnvNumber('NEXT_PUBLIC_API_TIMEOUT', 30000);
const pageSize = getEnvNumber('NEXT_PUBLIC_DEFAULT_PAGE_SIZE', 10);
```

### 4. Validate Critical Variables

```typescript
import { validateEnv } from '@/config/env';

// Validate on app start
validateEnv();
```

### 5. Document All Variables

Always update `.env.local.example` when adding new variables:

```bash
# New feature flag
NEXT_PUBLIC_FEATURE_NEW_DASHBOARD=false  # Enable new dashboard UI
```

---

## 🔒 Security

### Environment Variable Security

#### Client-Side Variables (NEXT_PUBLIC_*)

**Exposed to browser** - Never use for secrets!

```bash
# ✅ SAFE - Public configuration
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
NEXT_PUBLIC_APP_VERSION=3.3.0

# ❌ UNSAFE - Secrets exposed to client!
NEXT_PUBLIC_API_SECRET_KEY=secret123      # ❌ DON'T DO THIS!
NEXT_PUBLIC_DATABASE_PASSWORD=pass123     # ❌ DON'T DO THIS!
```

#### Server-Side Variables (No prefix)

**NOT exposed to browser** - Safe for secrets:

```bash
# ✅ SAFE - Server-side only
DATABASE_URL=postgresql://...
API_SECRET_KEY=your-secret-key
ENCRYPTION_KEY=your-encryption-key
```

### Git Security

Always add to `.gitignore`:

```gitignore
# Environment files
.env
.env.local
.env.development
.env.staging
.env.production

# ✅ DO commit example files
# .env.local.example
```

### Never Commit Secrets

```bash
# ❌ DON'T commit these
git add .env.local           # ❌ NO!
git add .env.production      # ❌ NO!

# ✅ DO commit these
git add .env.local.example   # ✅ YES
```

---

## 🐛 Troubleshooting

### Issue 1: Environment Variables Not Loading

**Problem**: Changes to `.env.local` not reflected

**Solution**: 
```bash
# ⚠️ Next.js doesn't hot-reload env vars
# You MUST restart the server!

# Stop server (Ctrl+C)
# Then restart:
npm run dev
```

### Issue 2: "Cannot find module" Error

**Problem**: Environment variable is undefined

**Solution**:
```bash
# 1. Check variable exists in .env.local
cat .env.local | grep NEXT_PUBLIC_API_BASE_URL

# 2. Check correct prefix
# Must start with NEXT_PUBLIC_ for client-side access

# 3. Restart server
npm run dev
```

### Issue 3: Wrong Environment Selected

**Problem**: Using wrong API URL

**Solution**:
```bash
# Check current environment
cat .env.local | grep NEXT_PUBLIC_ENVIRONMENT

# Should be: local | dev | staging | production

# Verify in browser console:
console.log(process.env.NEXT_PUBLIC_ENVIRONMENT);
```

### Issue 4: Variables Undefined in Production

**Problem**: Env vars work locally but not in production

**Solution**:
```bash
# Set environment variables in your hosting platform:
# - Vercel: Project Settings → Environment Variables
# - Netlify: Site Settings → Build & Deploy → Environment
# - AWS: Use Parameter Store or Secrets Manager

# Ensure all NEXT_PUBLIC_* variables are set
```

### Issue 5: Mock API Not Working

**Problem**: Still connecting to real API despite NEXT_PUBLIC_USE_MOCK_API=true

**Solution**:
```bash
# 1. Check .env.local
cat .env.local | grep NEXT_PUBLIC_USE_MOCK_API

# 2. Must be exactly 'true' (lowercase, no quotes)
NEXT_PUBLIC_USE_MOCK_API=true

# 3. Restart server
npm run dev

# 4. Verify in Environment Panel (bottom-right corner)
# Should show: "Mock API: Enabled"
```

---

## 📝 Quick Reference

### Environment Files Priority

Next.js loads env files in this order (later files override earlier):

1. `.env` - All environments
2. `.env.local` - All environments (not committed)
3. `.env.development` - Development only
4. `.env.production` - Production only

### Common Commands

```bash
# Create .env.local from example
cp .env.local.example .env.local

# View current environment
cat .env.local | grep NEXT_PUBLIC_ENVIRONMENT

# Check all env vars
cat .env.local

# Start development
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Switching Environments

```bash
# Switch to DEV
sed -i 's/NEXT_PUBLIC_ENVIRONMENT=.*/NEXT_PUBLIC_ENVIRONMENT=dev/' .env.local
npm run dev

# Switch to STAGING
sed -i 's/NEXT_PUBLIC_ENVIRONMENT=.*/NEXT_PUBLIC_ENVIRONMENT=staging/' .env.local
npm run dev

# Switch to PRODUCTION
sed -i 's/NEXT_PUBLIC_ENVIRONMENT=.*/NEXT_PUBLIC_ENVIRONMENT=production/' .env.local
npm run build && npm start
```

---

## 📚 Related Documentation

- [Installation Guide](../setup/INSTALL.md)
- [Quick Start](../setup/QUICKSTART.md)
- [API Integration](../api/INTEGRATION_GUIDE.md)
- [Security Best Practices](../security/BEST_PRACTICES.md)
- [Migration Guide](../migration/VITE_TO_NEXTJS.md)

---

## 🔗 External Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [12 Factor App - Config](https://12factor.net/config)

---

**Last Updated**: January 2026  
**Version**: 3.3.0  
**Framework**: Next.js 15

[Back to Documentation Index](../README.md)
