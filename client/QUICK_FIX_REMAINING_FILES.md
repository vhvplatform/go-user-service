# 🔧 Quick Fix Guide - Update Remaining Files

## Files cần update (Copy-paste these changes):

### 1. EnvironmentPanel.tsx

**Find and Replace:**
```typescript
// Line ~49: Change
const env = process.env.NEXT_PUBLIC_ENVIRONMENT;
// To:
const env = import.meta.env.VITE_ENVIRONMENT;

// Line ~60-61: Change
message: 'NEXT_PUBLIC_ENVIRONMENT not set, using default "local"',
fix: 'Add NEXT_PUBLIC_ENVIRONMENT=local to .env.local file',
// To:
message: 'VITE_ENVIRONMENT not set, using default "local"',
fix: 'Add VITE_ENVIRONMENT=local to .env file',

// Line ~66: Change
const mockEnv = process.env.NEXT_PUBLIC_USE_MOCK_API;
// To:
const mockEnv = import.meta.env.VITE_USE_MOCK_API;

// Line ~84-85: Change
message: 'NEXT_PUBLIC_USE_MOCK_API not configured, defaulting to mock mode',
fix: 'Add NEXT_PUBLIC_USE_MOCK_API=true to .env.local file and restart server',
// To:
message: 'VITE_USE_MOCK_API not configured, defaulting to mock mode',
fix: 'Add VITE_USE_MOCK_API=true to .env file and restart server',

// Line ~90: Change
const apiUrl = process.env.NEXT_PUBLIC_API_URL_LOCAL;
// To:
const apiUrl = import.meta.env.VITE_API_URL_LOCAL;

// Line ~102: Change
fix: 'Add NEXT_PUBLIC_API_URL_LOCAL to .env.local file',
// To:
fix: 'Add VITE_API_URL_LOCAL to .env file',

// Line ~305: Change text in UI
<li>Đổi <code>NEXT_PUBLIC_ENVIRONMENT</code></li>
// To:
<li>Đổi <code>VITE_ENVIRONMENT</code></li>
```

---

### 2. DevelopmentBanner.tsx

**Find and Replace:**
```typescript
// Line ~84-87: Change in instructions
<li>Mở file <code>.env.local</code></li>
<li>Đổi <code>NEXT_PUBLIC_ENVIRONMENT</code> (dev/dev-shared/staging/production)</li>
<li>Toggle <code>NEXT_PUBLIC_USE_MOCK_DATA</code> (true/false)</li>
// To:
<li>Mở file <code>.env</code></li>
<li>Đổi <code>VITE_ENVIRONMENT</code> (dev/dev-shared/staging/production)</li>
<li>Toggle <code>VITE_USE_MOCK_DATA</code> (true/false)</li>
```

---

### 3. MockDataWarning.tsx

**Find and Replace:**
```typescript
// Line ~54-56: Change
<div>Tạo file <code>.env.local</code> với nội dung:</div>
<div className="mt-1 text-orange-600 dark:text-orange-400">
  NEXT_PUBLIC_USE_MOCK_API=true
</div>
// To:
<div>Tạo file <code>.env</code> với nội dung:</div>
<div className="mt-1 text-orange-600 dark:text-orange-400">
  VITE_USE_MOCK_API=true
</div>
```

---

### 4. NetworkErrorFallback.tsx

**Find and Replace:**
```typescript
// Line ~16-20: Change envConfig string
const envConfig = `# Environment Configuration
NEXT_PUBLIC_ENVIRONMENT=local
NEXT_PUBLIC_API_URL_LOCAL=http://localhost:8080/api/v1
NEXT_PUBLIC_USE_MOCK_API=true
NEXT_PUBLIC_ENABLE_DEBUG=true`;
// To:
const envConfig = `# Environment Configuration
VITE_ENVIRONMENT=local
VITE_API_URL_LOCAL=http://localhost:8080/api/v1
VITE_USE_MOCK_API=true
VITE_ENABLE_DEBUG=true`;
```

---

### 5. ApiDemo.tsx

**Find and Replace:**
```typescript
// Line ~252-253: Change
<strong>Note:</strong> This demo uses mock data. Enable mock mode in .env.local: 
<code>NEXT_PUBLIC_USE_MOCK_API=true</code>
// To:
<strong>Note:</strong> This demo uses mock data. Enable mock mode in .env: 
<code>VITE_USE_MOCK_API=true</code>
```

---

## ⚡ Automated Find & Replace (for VSCode)

Open VSCode's Find & Replace (Ctrl+Shift+H) and run these:

### Replace 1: NEXT_PUBLIC_ → VITE_
```
Find: NEXT_PUBLIC_
Replace: VITE_
Files to include: src/app/components/**/*.tsx
```

### Replace 2: process.env.NEXT_PUBLIC → import.meta.env.VITE
```
Find: process\.env\.NEXT_PUBLIC_
Replace: import.meta.env.VITE_
Files to include: src/app/components/**/*.tsx
```

### Replace 3: .env.local → .env
```
Find: \.env\.local
Replace: .env
Files to include: src/app/components/**/*.tsx
```

---

## ✅ Verification Steps

After making changes:

1. **Check Syntax**:
   ```bash
   npm run type-check
   # or
   npx tsc --noEmit
   ```

2. **Test App**:
   ```bash
   npm run dev
   ```

3. **Verify Components**:
   - Open app in browser
   - Check Environment Panel (bottom right)
   - Check no console errors
   - Verify environment variables load correctly

4. **Test Environment Switching**:
   - Edit `.env`: `VITE_ENVIRONMENT=dev`
   - Restart server
   - Check Environment Indicator shows "dev"

---

## 🚨 Common Issues

### Issue 1: "undefined" in UI
**Cause**: Using old `process.env.NEXT_PUBLIC_*`  
**Fix**: Change to `import.meta.env.VITE_*`

### Issue 2: Variables not updating
**Cause**: Forgot to restart server  
**Fix**: Stop (Ctrl+C) and run `npm run dev` again

### Issue 3: Type errors
**Cause**: TypeScript doesn't recognize `import.meta.env`  
**Fix**: Check `vite-env.d.ts` exists in project root

---

## 📞 Quick Help

If stuck, check:
1. `/.env.example` - See all variable names
2. `/MIGRATION_VITE_COMPLETE.md` - Migration guide
3. `/src/config/viteEnv.ts` - See how variables are loaded

---

**Estimated Time to Complete**: 10-15 minutes  
**Difficulty**: Easy (mostly find & replace)  
**Impact**: High (fixes all remaining NextJS references)
