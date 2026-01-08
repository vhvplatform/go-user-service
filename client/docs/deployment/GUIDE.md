# 🚢 Deployment Guide

> Complete guide for deploying VHV Platform to production

**Version**: 3.3.0  
**Framework**: Next.js 15  
**Last Updated**: January 2026

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Environment Configuration](#environment-configuration)
4. [Vercel Deployment](#vercel-deployment)
5. [Netlify Deployment](#netlify-deployment)
6. [Docker Deployment](#docker-deployment)
7. [Traditional Server](#traditional-server)
8. [Post-Deployment](#post-deployment)
9. [Monitoring](#monitoring)

---

## 🎯 Overview

### Supported Platforms

✅ **Recommended:**
- **Vercel** - Best for Next.js (made by Next.js creators)
- **Netlify** - Easy deployment with great DX
- **Docker** - Full control, any cloud provider

✅ **Also Supported:**
- AWS (EC2, ECS, Lambda)
- Google Cloud Platform
- Azure
- DigitalOcean
- Traditional VPS

---

## ✅ Pre-Deployment Checklist

### Code Quality

- [ ] All tests passing (`npm test`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] Production build tested (`npm start`)

### Security

- [ ] All secrets moved to environment variables
- [ ] No `.env.local` in Git
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] CSP (Content Security Policy) enabled
- [ ] Rate limiting implemented
- [ ] Input validation on all forms

### Performance

- [ ] Images optimized
- [ ] Code splitting enabled
- [ ] Lazy loading implemented
- [ ] Bundle size optimized
- [ ] Performance tested

### Configuration

- [ ] Environment variables documented
- [ ] API URLs updated for production
- [ ] Error tracking configured
- [ ] Analytics set up (optional)
- [ ] Monitoring configured

---

## 🔧 Environment Configuration

### Required Environment Variables

Create these in your hosting platform:

```bash
# Core Configuration
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_USE_MOCK_API=false

# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://api.vhvplatform.com/api/v1
NEXT_PUBLIC_API_TIMEOUT=30000

# Microservices (if applicable)
NEXT_PUBLIC_USER_SERVICE_URL=https://api.vhvplatform.com/user-service
NEXT_PUBLIC_AUTH_SERVICE_URL=https://api.vhvplatform.com/auth-service
NEXT_PUBLIC_FILE_SERVICE_URL=https://api.vhvplatform.com/file-service

# Application Info
NEXT_PUBLIC_APP_NAME=VHV Platform
NEXT_PUBLIC_APP_VERSION=3.3.0
NEXT_PUBLIC_APP_ENV=production

# Tenant Configuration
NEXT_PUBLIC_TENANT_ID=your-tenant-id
NEXT_PUBLIC_TENANT_NAME=Your Company Name

# Security
NEXT_PUBLIC_FORCE_HTTPS=true
NEXT_PUBLIC_SESSION_TIMEOUT=3600
NEXT_PUBLIC_ENABLE_REQUEST_SIGNING=true

# Optional: Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Server-Side Only (NO NEXT_PUBLIC_ prefix!)
DATABASE_URL=postgresql://user:pass@host:5432/db
API_SECRET_KEY=your-secret-key
ENCRYPTION_KEY=your-encryption-key-32-characters-minimum
```

### Environment Template

Download complete template: `.env.local.example`

---

## ▲ Vercel Deployment

### Method 1: GitHub Integration (Recommended)

**Step 1: Push to GitHub**

```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/your-username/vhv-platform.git
git branch -M main
git push -u origin main
```

**Step 2: Import to Vercel**

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Vercel auto-detects Next.js configuration

**Step 3: Configure Environment Variables**

1. Go to Project Settings → Environment Variables
2. Add all `NEXT_PUBLIC_*` variables
3. Add server-side variables (without `NEXT_PUBLIC_` prefix)
4. Click "Deploy"

**Step 4: Deploy**

```bash
# Vercel deploys automatically on:
# - Push to main branch
# - Pull request (preview deployment)

# Manual deployment:
npm install -g vercel
vercel
```

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Production deployment
vercel --prod
```

### Vercel Configuration

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_ENVIRONMENT": "production"
  }
}
```

### Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS:
   ```
   Type: CNAME
   Name: www (or @)
   Value: cname.vercel-dns.com
   ```
4. Wait for DNS propagation (5-30 minutes)

---

## 🌐 Netlify Deployment

### Method 1: Git Integration

**Step 1: Connect Repository**

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub/GitLab/Bitbucket
4. Select your repository

**Step 2: Build Settings**

```
Build command: npm run build
Publish directory: .next
```

**Step 3: Environment Variables**

1. Site Settings → Build & deploy → Environment
2. Add all environment variables
3. Click "Deploy site"

### Method 2: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy

# Production deployment
netlify deploy --prod
```

### Netlify Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NEXT_PUBLIC_ENVIRONMENT = "production"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

---

## 🐳 Docker Deployment

### Dockerfile

Create `Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Set environment variables for build
ENV NEXT_PUBLIC_ENVIRONMENT=production
ENV NEXT_PUBLIC_API_BASE_URL=https://api.vhvplatform.com/api/v1

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_ENVIRONMENT=production
      - NEXT_PUBLIC_API_BASE_URL=https://api.vhvplatform.com/api/v1
      - NEXT_PUBLIC_USE_MOCK_API=false
      # Add other environment variables
    restart: unless-stopped
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

### Build and Run

```bash
# Build image
docker build -t vhv-platform:latest .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_ENVIRONMENT=production \
  -e NEXT_PUBLIC_API_BASE_URL=https://api.vhvplatform.com/api/v1 \
  vhv-platform:latest

# Or use Docker Compose
docker-compose up -d
```

---

## 🖥️ Traditional Server

### VPS / Dedicated Server

**Prerequisites:**
- Node.js 18+ installed
- PM2 or systemd for process management
- Nginx for reverse proxy

**Step 1: Server Setup**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2
```

**Step 2: Deploy Application**

```bash
# Clone repository
git clone https://github.com/your-username/vhv-platform.git
cd vhv-platform

# Install dependencies
npm ci --production

# Create .env.production
cat > .env.production << EOF
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_API_BASE_URL=https://api.vhvplatform.com/api/v1
# ... other variables
EOF

# Build
npm run build

# Start with PM2
pm2 start npm --name "vhv-platform" -- start
pm2 save
pm2 startup
```

**Step 3: Nginx Configuration**

```nginx
# /etc/nginx/sites-available/vhv-platform

server {
    listen 80;
    server_name app.vhvplatform.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name app.vhvplatform.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/app.vhvplatform.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.vhvplatform.com/privkey.pem;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/vhv-platform /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Get SSL certificate (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d app.vhvplatform.com
```

---

## ✅ Post-Deployment

### Verify Deployment

```bash
# 1. Check website loads
curl -I https://app.vhvplatform.com

# 2. Check environment
# Open browser console:
console.log(process.env.NEXT_PUBLIC_ENVIRONMENT);
// Should output: "production"

# 3. Test API connectivity
# Try login or API call

# 4. Check Environment Panel
# Should show: Production environment

# 5. Verify HTTPS
# Should redirect HTTP to HTTPS
```

### DNS Configuration

```
# A Record
Type: A
Name: @
Value: <your-server-ip>
TTL: 3600

# CNAME Record (for www)
Type: CNAME
Name: www
Value: app.vhvplatform.com
TTL: 3600
```

### Smoke Tests

- [ ] Homepage loads
- [ ] Login works
- [ ] API calls succeed
- [ ] Images load correctly
- [ ] Forms submit successfully
- [ ] Navigation works
- [ ] Mobile view responsive
- [ ] HTTPS enforced
- [ ] No console errors

---

## 📊 Monitoring

### Error Tracking

**Sentry Integration:**

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
  tracesSampleRate: 1.0,
});
```

### Performance Monitoring

**Vercel Analytics:**
```bash
npm install @vercel/analytics
```

```javascript
// pages/_app.tsx
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
```

### Uptime Monitoring

Use services like:
- **UptimeRobot** - Free uptime monitoring
- **Pingdom** - Comprehensive monitoring
- **StatusCake** - Multi-location checks

---

## 🔄 Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_ENVIRONMENT: production
          NEXT_PUBLIC_API_BASE_URL: ${{ secrets.API_BASE_URL }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 📚 Related Documentation

- [Environment Setup](../environment/COMPLETE_GUIDE.md)
- [Security Best Practices](../security/BEST_PRACTICES.md)
- [Troubleshooting](../troubleshooting/GUIDE.md)

---

## 🆘 Deployment Issues?

See [Troubleshooting Guide](../troubleshooting/GUIDE.md) or open an issue.

---

**Last Updated**: January 2026  
**Version**: 3.3.0

[Back to Documentation Index](../README.md)
