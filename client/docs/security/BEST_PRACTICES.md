# 🔒 Security Best Practices

> Comprehensive security guidelines for VHV Platform developers

**Version**: 3.3.0  
**Framework**: Next.js 15  
**Last Updated**: January 2026  

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Authentication & Authorization](#authentication--authorization)
3. [Data Protection](#data-protection)
4. [Input Validation](#input-validation)
5. [API Security](#api-security)
6. [Environment Variables](#environment-variables)
7. [Error Handling](#error-handling)
8. [Security Headers](#security-headers)
9. [Code Examples](#code-examples)
10. [Security Checklist](#security-checklist)

---

## 🎯 Overview

### Security Principles

VHV Platform follows these core security principles:

1. **Defense in Depth** - Multiple layers of security
2. **Least Privilege** - Minimum necessary permissions
3. **Zero Trust** - Verify everything
4. **Secure by Default** - Opt-in for less secure options
5. **Privacy by Design** - Data protection built-in

### Implemented Security Features

✅ **25+ Security Features:**
- Token encryption & secure storage
- Request signing (HMAC-based)
- CSRF protection
- XSS prevention & input sanitization
- SQL injection protection
- Session management with timeout
- Rate limiting
- HTTPS enforcement
- Content Security Policy (CSP)
- Secure headers
- And more...

---

## 🔐 Authentication & Authorization

### ✅ DO: HttpOnly Cookies (Recommended)

**Best Practice**: Store auth tokens in HttpOnly cookies (backend-set)

```typescript
// ✅ Backend sets HttpOnly cookie (Go, Node.js, etc.)
res.cookie('auth_token', token, {
  httpOnly: true,    // JavaScript cannot access
  secure: true,      // HTTPS only
  sameSite: 'strict',// CSRF protection
  maxAge: 3600000,   // 1 hour
});

// ✅ Frontend - no token handling needed
// Browser automatically sends cookie with requests
await apiClient.get('/api/users'); // Cookie sent automatically
```

### ⚠️ Alternative: Encrypted localStorage

**If HttpOnly cookies aren't possible**, use encrypted storage:

```typescript
import { EncryptedStorage } from '@/utils/securityUtils';

// ✅ Store token securely
const storage = new EncryptedStorage(process.env.NEXT_PUBLIC_ENCRYPTION_KEY);
storage.setItem('auth_token', token);

// ✅ Retrieve token
const token = storage.getItem('auth_token');

// ✅ Clear on logout
storage.clear();
```

### ❌ DON'T: Plain localStorage

```typescript
// ❌ DON'T store tokens in plain localStorage (XSS vulnerability!)
localStorage.setItem('token', token);  // ❌ NO!

// ❌ DON'T store tokens in sessionStorage
sessionStorage.setItem('token', token); // ❌ NO!

// ❌ DON'T expose tokens in URL
window.location.href = `/dashboard?token=${token}`; // ❌ NO!
```

### Session Timeout

**Implement automatic logout:**

```typescript
import { SessionTimeoutChecker } from '@/utils/securityUtils';

// ✅ Auto-logout after 1 hour of inactivity
const sessionTimeout = new SessionTimeoutChecker(
  3600000, // 1 hour
  () => {
    // Auto logout
    logout();
    window.location.href = '/login';
  }
);

// Reset timer on user activity
document.addEventListener('click', () => sessionTimeout.resetTimer());
document.addEventListener('keypress', () => sessionTimeout.resetTimer());
```

### Permission Checks

**Always check permissions before actions:**

```typescript
import { hasPermission, canPerformAction } from '@/utils/permissions';

function DeleteButton({ user, currentUser }) {
  // ✅ Check global permission
  if (!canPerformAction(currentUser, 'user.delete')) {
    return null;
  }

  // ✅ Check specific user permission
  if (!canManageUser(currentUser, user)) {
    return null;
  }

  return <button onClick={handleDelete}>Delete</button>;
}
```

### Role-Based Access Control (RBAC)

```typescript
import { ProtectedRoute } from '@/app/components/ProtectedRoute';

// ✅ Protect routes by role
<ProtectedRoute allowedRoles={['admin', 'manager']}>
  <AdminPanel />
</ProtectedRoute>

// ✅ Check roles in components
function AdminFeature() {
  const { user } = useAuth();
  
  if (!user || user.role !== 'admin') {
    return <AccessDenied />;
  }
  
  return <AdminContent />;
}
```

---

## 🛡️ Data Protection

### Input Sanitization

**Always sanitize user input:**

```typescript
import { sanitizeInput, sanitizeHtml } from '@/utils/securityUtils';

// ✅ Sanitize text input
const cleanInput = sanitizeInput(userInput);

// ✅ Sanitize HTML content
const cleanHtml = sanitizeHtml(htmlContent);

// Example: Search functionality
function SearchBar() {
  const handleSearch = (query: string) => {
    // ✅ Sanitize before using
    const cleanQuery = sanitizeInput(query);
    searchUsers(cleanQuery);
  };
  
  return <input onChange={(e) => handleSearch(e.target.value)} />;
}
```

### XSS Prevention

```typescript
// ❌ DON'T use dangerouslySetInnerHTML without sanitization
<div dangerouslySetInnerHTML={{ __html: userContent }} /> // ❌ NO!

// ✅ DO sanitize first
import DOMPurify from 'dompurify';

const cleanHtml = DOMPurify.sanitize(userContent);
<div dangerouslySetInnerHTML={{ __html: cleanHtml }} /> // ✅ YES

// ✅ BETTER: Use text content when possible
<div>{userContent}</div> // ✅ BEST - React escapes automatically
```

### SQL Injection Protection

```typescript
// ❌ DON'T build SQL queries with string concatenation
const query = `SELECT * FROM users WHERE email = '${email}'`; // ❌ NO!

// ✅ DO use parameterized queries (backend)
const query = 'SELECT * FROM users WHERE email = $1';
db.query(query, [email]); // ✅ YES

// ✅ Frontend: Send data as JSON, let backend handle DB queries
await api.post('/users/search', { email }); // ✅ YES
```

### Sensitive Data Masking

```typescript
// ✅ Mask sensitive data in UI
function MaskEmail(email: string): string {
  const [name, domain] = email.split('@');
  const maskedName = name.slice(0, 2) + '***';
  return `${maskedName}@${domain}`;
}

// ✅ Mask credit card numbers
function MaskCreditCard(cardNumber: string): string {
  return '**** **** **** ' + cardNumber.slice(-4);
}

// ✅ Don't log sensitive data
console.log('User email:', MaskEmail(user.email)); // ✅ YES
console.log('User email:', user.email); // ❌ NO!
```

---

## ✅ Input Validation

### Client-Side Validation

```typescript
import { validateEmail, validatePassword, validatePhone } from '@/utils/validation';

function RegisterForm() {
  const handleSubmit = (data: FormData) => {
    // ✅ Validate email format
    if (!validateEmail(data.email)) {
      setError('Invalid email format');
      return;
    }
    
    // ✅ Validate password strength
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message);
      return;
    }
    
    // ✅ Validate phone number
    if (!validatePhone(data.phone)) {
      setError('Invalid phone number');
      return;
    }
    
    // Proceed with registration
    register(data);
  };
}
```

### Server-Side Validation

**⚠️ CRITICAL: Always validate on server too!**

```typescript
// ❌ DON'T trust client-side validation alone
// Client-side can be bypassed!

// ✅ DO validate again on server
// Backend example (Go, Node.js, etc.)
function validateRegistration(data) {
  // Validate all fields again
  if (!isValidEmail(data.email)) {
    return { error: 'Invalid email' };
  }
  
  if (!isStrongPassword(data.password)) {
    return { error: 'Weak password' };
  }
  
  // Proceed
  createUser(data);
}
```

### Type Validation

```typescript
// ✅ Use TypeScript for type safety
interface User {
  id: number;
  email: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
}

// ✅ Validate API responses
import { z } from 'zod';

const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  role: z.enum(['admin', 'user', 'guest']),
  createdAt: z.string().datetime(),
});

// Validate response
const user = UserSchema.parse(apiResponse);
```

---

## 🔌 API Security

### Request Signing

```typescript
import { signRequest } from '@/utils/securityUtils';

// ✅ Sign all API requests
async function secureApiCall(endpoint: string, data: any) {
  const signature = signRequest(endpoint, data);
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Request-Signature': signature,
    },
    body: JSON.stringify(data),
  });
  
  return response.json();
}
```

### CSRF Protection

```typescript
// ✅ Include CSRF token in forms
function SecureForm() {
  const csrfToken = useCSRFToken();
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="csrf_token" value={csrfToken} />
      {/* form fields */}
    </form>
  );
}

// ✅ Send CSRF token in API calls
await apiClient.post('/api/users', data, {
  headers: {
    'X-CSRF-Token': csrfToken,
  },
});
```

### Rate Limiting

```typescript
import { RateLimiter } from '@/utils/securityUtils';

// ✅ Limit API calls
const limiter = new RateLimiter(100, 60000); // 100 requests per minute

async function callAPI() {
  if (!limiter.tryAcquire()) {
    throw new Error('Rate limit exceeded');
  }
  
  return await api.get('/data');
}
```

### CORS Configuration

```typescript
// ✅ Configure CORS properly (backend)
const corsOptions = {
  origin: process.env.NEXT_PUBLIC_APP_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// ❌ DON'T use wildcard in production
const badCors = {
  origin: '*',  // ❌ NO! Allows any origin
};
```

---

## 🔑 Environment Variables

### Client-Side vs Server-Side

```bash
# ✅ Client-side (browser accessible) - NO SECRETS!
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
NEXT_PUBLIC_APP_VERSION=3.3.0

# ✅ Server-side only (NOT accessible in browser) - SAFE FOR SECRETS
DATABASE_URL=postgresql://user:pass@localhost/db
API_SECRET_KEY=your-secret-key
ENCRYPTION_KEY=your-encryption-key-min-32-chars
```

### Security Rules

```typescript
// ❌ DON'T expose secrets to client
NEXT_PUBLIC_API_SECRET_KEY=secret123  // ❌ NO! Exposed to browser!
NEXT_PUBLIC_DATABASE_PASSWORD=pass    // ❌ NO! Anyone can see!

// ✅ DO keep secrets server-side only
API_SECRET_KEY=secret123              // ✅ YES - Server only
DATABASE_PASSWORD=pass                // ✅ YES - Server only

// ✅ Use server-side API routes for sensitive operations
// pages/api/secure-operation.ts
export default async function handler(req, res) {
  const secretKey = process.env.API_SECRET_KEY; // ✅ Safe - server-side
  // Use secret key here
}
```

### Never Commit Secrets

```bash
# ❌ DON'T commit to Git
git add .env.local           # ❌ NO!
git add .env.production      # ❌ NO!

# ✅ DO commit example files
git add .env.local.example   # ✅ YES

# ✅ Add to .gitignore
.env
.env.local
.env*.local
.env.development
.env.production
```

---

## 🚨 Error Handling

### Secure Error Messages

```typescript
// ❌ DON'T expose internal errors
catch (error) {
  console.log('Database error:', error.message); // ❌ Logs sensitive info
  toast.error(error.message); // ❌ Shows internal error to user
}

// ✅ DO use generic messages for users
catch (error) {
  console.error('Internal error:', error); // ✅ Log for debugging
  
  if (process.env.NODE_ENV === 'production') {
    toast.error('An error occurred. Please try again.'); // ✅ Generic message
  } else {
    toast.error(error.message); // ✅ Detailed in development
  }
}
```

### Error Logging

```typescript
// ✅ Log errors securely
import { logError } from '@/utils/logger';

try {
  await riskyOperation();
} catch (error) {
  // ✅ Log error (without sensitive data)
  logError('Operation failed', {
    operation: 'user-update',
    userId: user.id, // ✅ OK - ID only
    timestamp: new Date(),
    // ❌ DON'T log passwords, tokens, etc.
  });
  
  // Show user-friendly message
  toast.error('Update failed. Please try again.');
}
```

---

## 🔒 Security Headers

### Content Security Policy

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://api.vhvplatform.com",
            ].join('; '),
          },
        ],
      },
    ];
  },
};
```

### Other Security Headers

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
];
```

---

## 💻 Code Examples

### Secure User Registration

```typescript
import { validateEmail, validatePassword, sanitizeInput } from '@/utils/validation';
import { hashPassword } from '@/utils/security';

async function registerUser(data: RegisterData) {
  // 1. Sanitize inputs
  const email = sanitizeInput(data.email);
  const name = sanitizeInput(data.name);
  
  // 2. Validate email
  if (!validateEmail(email)) {
    throw new Error('Invalid email format');
  }
  
  // 3. Validate password strength
  const passwordCheck = validatePassword(data.password);
  if (!passwordCheck.isValid) {
    throw new Error(passwordCheck.message);
  }
  
  // 4. Hash password (backend)
  const hashedPassword = await hashPassword(data.password);
  
  // 5. Create user
  const user = await api.post('/users', {
    email,
    name,
    password: hashedPassword,
  });
  
  return user;
}
```

### Secure API Client

```typescript
import { apiClient } from '@/services/api/apiClient';

// ✅ All security features built-in
const response = await apiClient.get('/users');
// - Automatic token attachment
// - Request signing
// - CSRF protection
// - Error handling
// - Rate limiting
```

---

## ✅ Security Checklist

### Development

- [ ] All user inputs are sanitized
- [ ] All forms have validation (client + server)
- [ ] No sensitive data in console.log
- [ ] No secrets in environment variables with NEXT_PUBLIC_ prefix
- [ ] HTTPS enforced (except localhost)
- [ ] Content Security Policy configured
- [ ] Security headers implemented
- [ ] CORS configured properly
- [ ] Rate limiting implemented
- [ ] Session timeout configured
- [ ] Permission checks on all actions
- [ ] Error messages don't expose internals
- [ ] XSS prevention (DOMPurify)
- [ ] SQL injection prevention (parameterized queries)

### Pre-Production

- [ ] Security audit completed
- [ ] Penetration testing done
- [ ] Dependencies updated (no vulnerabilities)
- [ ] Secrets rotation plan in place
- [ ] Monitoring and logging configured
- [ ] Incident response plan ready
- [ ] Backup and recovery tested
- [ ] SSL/TLS certificates valid

### Production

- [ ] All .env files excluded from Git
- [ ] Production secrets stored securely
- [ ] HTTPS only (no HTTP)
- [ ] Security headers verified
- [ ] Error tracking enabled
- [ ] Access logs monitored
- [ ] Regular security updates scheduled
- [ ] Compliance requirements met (GDPR, etc.)

---

## 📚 Related Documentation

- [Security Implementation Guide](./IMPLEMENTATION_GUIDE.md)
- [Environment Configuration](../environment/COMPLETE_GUIDE.md)
- [API Integration](../api/INTEGRATION_GUIDE.md)
- [Troubleshooting](../troubleshooting/GUIDE.md)

---

## 🔗 External Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Web Security Checklist](https://websecuritychecklist.org/)

---

**Remember**: Security is not a feature, it's a requirement!

**Last Updated**: January 2026  
**Version**: 3.3.0

[Back to Documentation Index](../README.md)
