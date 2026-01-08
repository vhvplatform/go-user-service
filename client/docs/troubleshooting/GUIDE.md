# 🔧 Troubleshooting Guide

> Common issues and solutions for VHV Platform

**Version**: 3.3.0  
**Framework**: Next.js 15  
**Last Updated**: January 2026

---

## 📋 Table of Contents

1. [Environment Variables](#environment-variables)
2. [Development Server](#development-server)
3. [Build & Deployment](#build--deployment)
4. [API & Network](#api--network)
5. [Authentication](#authentication)
6. [Performance](#performance)
7. [TypeScript](#typescript)
8. [Dependencies](#dependencies)

---

## 🌍 Environment Variables

### Issue: Environment Variables Not Loading

**Symptoms:**
- `process.env.NEXT_PUBLIC_*` returns `undefined`
- Features not working
- API calls failing

**Solutions:**

```bash
# 1. Check if .env.local exists
ls -la | grep .env.local

# 2. If not, create from example
cp .env.local.example .env.local

# 3. Check variable exists
cat .env.local | grep NEXT_PUBLIC_API_BASE_URL

# 4. RESTART dev server (REQUIRED!)
# Next.js doesn't hot-reload env vars
# Stop server (Ctrl+C) and restart:
npm run dev

# 5. Verify in browser console
console.log(process.env.NEXT_PUBLIC_API_BASE_URL);
```

### Issue: Variables Work Locally But Not in Production

**Symptoms:**
- Works on `localhost`
- Fails in deployed version
- API calls return errors in production

**Solutions:**

```bash
# Set environment variables in hosting platform:

# Vercel:
# 1. Go to Project Settings
# 2. Click "Environment Variables"
# 3. Add all NEXT_PUBLIC_* variables
# 4. Redeploy

# Netlify:
# 1. Site Settings → Build & deploy
# 2. Environment → Edit variables
# 3. Add all NEXT_PUBLIC_* variables
# 4. Trigger new deploy

# Check what was built:
npm run build
# Variables are embedded during build time!
```

### Issue: "NEXT_PUBLIC_*" Not Defined

**Symptoms:**
- TypeScript errors
- Variable shows as undefined
- Linter warnings

**Solutions:**

```typescript
// 1. Ensure correct prefix
// ❌ Wrong
VITE_API_URL=...          // Old Vite prefix
PUBLIC_API_URL=...        // Missing NEXT_ prefix
NEXT_API_URL=...          // Missing PUBLIC_ part

// ✅ Correct
NEXT_PUBLIC_API_URL=...   // Correct Next.js prefix

// 2. Add type definitions (if needed)
// next-env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_BASE_URL: string;
    NEXT_PUBLIC_ENVIRONMENT: string;
    // ... other variables
  }
}
```

---

## 🖥️ Development Server

### Issue: Port 3000 Already in Use

**Symptoms:**
- Error: `Port 3000 is already in use`
- Server won't start

**Solutions:**

```bash
# Option 1: Kill process on port 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Option 2: Use different port
PORT=3001 npm run dev

# Option 3: Add to package.json
{
  "scripts": {
    "dev": "next dev -p 3001"
  }
}
```

### Issue: Hot Reload Not Working

**Symptoms:**
- Changes not reflected
- Need to manually refresh
- Server not detecting changes

**Solutions:**

```bash
# 1. Check file watcher limits (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# 2. Clear Next.js cache
rm -rf .next
npm run dev

# 3. Check gitignore patterns
# Ensure files aren't ignored

# 4. Restart server
# Stop (Ctrl+C) and restart:
npm run dev
```

### Issue: Slow Server Startup

**Symptoms:**
- Server takes long to start
- Slow page loads in development

**Solutions:**

```bash
# 1. Clear cache
rm -rf .next
rm -rf node_modules/.cache

# 2. Update dependencies
npm update

# 3. Check system resources
# Close other applications

# 4. Disable source maps in development (faster but harder to debug)
# next.config.js
module.exports = {
  productionBrowserSourceMaps: false,
};
```

---

## 🏗️ Build & Deployment

### Issue: Build Fails with Type Errors

**Symptoms:**
- `npm run build` fails
- TypeScript errors
- Type checking errors

**Solutions:**

```bash
# 1. Check TypeScript errors
npm run type-check

# 2. Fix errors or temporarily skip (not recommended)
# next.config.js
module.exports = {
  typescript: {
    ignoreBuildErrors: true, // ⚠️ NOT recommended for production
  },
};

# 3. Update types
npm install --save-dev @types/react @types/node

# 4. Clear cache and rebuild
rm -rf .next
npm run build
```

### Issue: Build Fails with "Out of Memory"

**Symptoms:**
- Build crashes
- "JavaScript heap out of memory" error

**Solutions:**

```bash
# 1. Increase Node.js memory limit
# package.json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}

# 2. Windows
{
  "scripts": {
    "build": "set NODE_OPTIONS=--max-old-space-size=4096 && next build"
  }
}

# 3. Or run directly
NODE_OPTIONS='--max-old-space-size=4096' npm run build
```

### Issue: Build Success But App Doesn't Work

**Symptoms:**
- Build completes
- App shows errors in browser
- Features not working

**Solutions:**

```bash
# 1. Check browser console for errors
# Open DevTools → Console

# 2. Verify environment variables are set
# They're embedded during build time!

# 3. Test production build locally
npm run build
npm start

# 4. Check for missing dependencies
npm install

# 5. Clear browser cache
# Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

---

## 🔌 API & Network

### Issue: API Calls Failing (CORS Errors)

**Symptoms:**
- Network errors in console
- "CORS policy" error
- API returns 403/401

**Solutions:**

```typescript
// 1. Check API URL is correct
console.log(process.env.NEXT_PUBLIC_API_BASE_URL);

// 2. Verify backend CORS configuration (backend code)
// Express example:
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// 3. Check credentials in API client
// /src/services/api/apiClient.ts
axios.create({
  withCredentials: true, // Important for cookies
});

// 4. Use Next.js API routes as proxy (recommended)
// pages/api/proxy.ts
export default async function handler(req, res) {
  const response = await fetch(process.env.BACKEND_URL + req.url);
  const data = await response.json();
  res.json(data);
}
```

### Issue: API Calls Work in Dev But Not Production

**Symptoms:**
- Works on `localhost:3000`
- Fails on production URL
- Network errors in production

**Solutions:**

```bash
# 1. Check environment variables in production
# Must be set in hosting platform!

# 2. Check API URL
# Development:
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1

# Production:
NEXT_PUBLIC_API_BASE_URL=https://api.vhvplatform.com/api/v1

# 3. Verify SSL/HTTPS
# Production must use HTTPS!

# 4. Check CORS on backend
# Must allow production domain
```

### Issue: Mock API Not Working

**Symptoms:**
- Setting `NEXT_PUBLIC_USE_MOCK_API=true` has no effect
- Still trying to connect to real API

**Solutions:**

```bash
# 1. Check exact value (must be lowercase 'true')
# ❌ Wrong
NEXT_PUBLIC_USE_MOCK_API=TRUE
NEXT_PUBLIC_USE_MOCK_API=True
NEXT_PUBLIC_USE_MOCK_API="true"

# ✅ Correct
NEXT_PUBLIC_USE_MOCK_API=true

# 2. Restart server (REQUIRED!)
npm run dev

# 3. Verify in Environment Panel
# Should show: "Mock API: Enabled"

# 4. Check in code
console.log(process.env.NEXT_PUBLIC_USE_MOCK_API);
// Should log: "true" (string)

# 5. Check boolean conversion
const isMock = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';
console.log(isMock); // Should be: true (boolean)
```

---

## 🔐 Authentication

### Issue: Auto-Logout / Session Expires Immediately

**Symptoms:**
- Logged out right after login
- Session doesn't persist
- Token not stored

**Solutions:**

```typescript
// 1. Check session timeout configuration
// .env.local
NEXT_PUBLIC_SESSION_TIMEOUT=3600  // 1 hour in seconds

// 2. Check token storage
// Use encrypted storage or httpOnly cookies

// 3. Verify token format
// Should be JWT format

// 4. Check browser storage
// DevTools → Application → Local Storage
// Should see encrypted token

// 5. Disable session timeout for testing
// src/contexts/AuthContext.tsx
// Comment out session timeout checker
```

### Issue: "Unauthorized" After Login

**Symptoms:**
- Login succeeds
- Subsequent API calls fail with 401
- Token seems valid

**Solutions:**

```typescript
// 1. Check token is being sent
// DevTools → Network → Headers
// Should see: Authorization: Bearer <token>

// 2. Verify API client includes token
// src/services/api/apiClient.ts
axios.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 3. Check token expiration
// Decode JWT token:
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Token expires:', new Date(payload.exp * 1000));

// 4. Implement token refresh
// If token expired, refresh before API call
```

---

## ⚡ Performance

### Issue: Slow Page Load

**Symptoms:**
- Pages take long to load
- Slow initial render
- High Time to Interactive (TTI)

**Solutions:**

```typescript
// 1. Enable code splitting
// next.config.js
module.exports = {
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

// 2. Use dynamic imports
// ❌ Static import
import HeavyComponent from './HeavyComponent';

// ✅ Dynamic import
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
});

// 3. Optimize images
// Use Next.js Image component
import Image from 'next/image';
<Image src="/logo.png" alt="Logo" width={200} height={50} />

// 4. Check bundle size
npm run build
# Review output for large chunks

// 5. Analyze bundle
npm install --save-dev @next/bundle-analyzer
# Enable in next.config.js
```

### Issue: High Memory Usage

**Symptoms:**
- Browser slows down
- Tab crashes
- High RAM usage

**Solutions:**

```typescript
// 1. Check for memory leaks
// Use React DevTools Profiler

// 2. Clean up useEffect
useEffect(() => {
  const interval = setInterval(() => {}, 1000);
  
  // ✅ Always cleanup
  return () => clearInterval(interval);
}, []);

// 3. Avoid creating functions in render
// ❌ Creates new function every render
<button onClick={() => handleClick(id)}>Click</button>

// ✅ Use useCallback
const handleClickMemo = useCallback(() => handleClick(id), [id]);
<button onClick={handleClickMemo}>Click</button>

// 4. Use React.memo for expensive components
export default React.memo(ExpensiveComponent);
```

---

## 📘 TypeScript

### Issue: Type Errors in Components

**Symptoms:**
- Red underlines in IDE
- Type errors during build
- "Type X is not assignable to type Y"

**Solutions:**

```typescript
// 1. Install missing types
npm install --save-dev @types/react @types/node

// 2. Check tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "jsx": "preserve",
    "esModuleInterop": true,
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "incremental": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true
  }
}

// 3. Type component props correctly
interface Props {
  user: User;
  onSave: (user: User) => void;
}

export function UserCard({ user, onSave }: Props) {
  // ...
}

// 4. Use type assertion when needed
const element = document.getElementById('root') as HTMLElement;
```

---

## 📦 Dependencies

### Issue: "Module not found" Error

**Symptoms:**
- Import errors
- "Cannot find module 'X'"
- Build fails

**Solutions:**

```bash
# 1. Install missing dependency
npm install package-name

# 2. Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# 3. Check import path
# ❌ Wrong
import { Button } from 'components/Button';

# ✅ Correct (with path alias)
import { Button } from '@/app/components/Button';

# 4. Verify tsconfig.json paths
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue: Dependency Version Conflicts

**Symptoms:**
- npm install warns about conflicts
- Features not working
- Type errors

**Solutions:**

```bash
# 1. Check for peer dependency warnings
npm install
# Read warnings carefully

# 2. Install peer dependencies
npm install peer-dependency-name

# 3. Update all dependencies
npm update

# 4. Use exact versions (if needed)
npm install package-name@exact-version

# 5. Check package.json for conflicts
# Ensure compatible versions
```

---

## 🆘 Getting More Help

### Enable Debug Mode

```bash
# .env.local
NEXT_PUBLIC_ENABLE_DEBUG=true
NEXT_PUBLIC_LOG_LEVEL=debug

# Restart server
npm run dev
```

### Check Logs

```bash
# Development logs
# Check terminal where npm run dev is running

# Production logs
# Check hosting platform logs:
# - Vercel: Deployments → View Function Logs
# - Netlify: Deploys → View deploy log
```

### Browser DevTools

```javascript
// Check environment variables
console.log('Environment:', process.env.NEXT_PUBLIC_ENVIRONMENT);
console.log('API URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
console.log('Use Mock:', process.env.NEXT_PUBLIC_USE_MOCK_API);

// Check API client
import { apiClient } from '@/services/api/apiClient';
console.log('API Client:', apiClient.defaults);
```

### Environment Panel

The app has a built-in Environment Panel (bottom-right corner) showing:
- Current environment
- API URL
- Mock mode status
- Debug status

---

## 📚 Related Documentation

- [Installation Guide](../setup/INSTALL.md)
- [Environment Setup](../environment/COMPLETE_GUIDE.md)
- [API Integration](../api/INTEGRATION_GUIDE.md)
- [Migration Guide](../migration/VITE_TO_NEXTJS.md)

---

## 💬 Community Support

- **GitHub Issues**: [Report bugs](https://github.com/vhvplatform/frontend/issues)
- **Discussions**: [Ask questions](https://github.com/vhvplatform/frontend/discussions)
- **Documentation**: [Full docs](../README.md)

---

**Still having issues?** Open an issue on GitHub with:
1. Error message
2. Steps to reproduce
3. Environment details
4. Screenshots (if applicable)

**Last Updated**: January 2026  
**Version**: 3.3.0

[Back to Documentation Index](../README.md)
