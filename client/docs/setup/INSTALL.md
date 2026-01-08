# VHV Platform - Installation Guide

## 📦 System Requirements

- Node.js >= 18.x
- npm >= 9.x (or yarn >= 1.22.x or pnpm >= 8.x)

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

Or with yarn:
```bash
yarn install
```

Or with pnpm:
```bash
pnpm install
```

### 2. Environment Configuration

⚠️ **IMPORTANT**: This project now uses **Next.js** (migrated from Vite)

Create `.env.local` file from the example:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Environment
NEXT_PUBLIC_ENVIRONMENT=local

# Mock API Mode
NEXT_PUBLIC_USE_MOCK_API=true
```

**Development mode**: Uses mock data (60+ users) - no backend required

**Production mode**: Connects to Go backend API
```env
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

### 3. Run Development Server

```bash
npm run dev
```

Application will open at: **http://localhost:3000** (Next.js default)

### 4. Build for Production

```bash
npm run build
```

Output: `.next/` directory

### 5. Preview Production Build

```bash
npm start
```

## 📊 Available Features

### ✅ Development Mode (Mock Data)
- 60+ mock users with realistic data
- Dashboard with charts and statistics
- User management with CRUD operations
- Search, filter, sort, pagination
- Export to CSV

### 🔗 Production Mode (Go Backend)
Backend needs to implement API endpoints according to spec in README.md

## 🎨 Interface

- **Dashboard**: `/` - System overview
- **User Management**: Click "Quản lý người dùng" in sidebar

## 🛠️ Troubleshooting

### Port 3000 Already in Use
Edit `next.config.js` to change port:
```javascript
module.exports = {
  // ... other config
  serverRuntimeConfig: {
    port: 3001, // change to different port
  },
}
```

Or run with custom port:
```bash
PORT=3001 npm run dev
```

### Dependencies Error
```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Environment Variables Not Loading
⚠️ **Next.js requires server restart** after changing `.env.local` file!

```bash
# Stop server (Ctrl+C) and restart
npm run dev
```

## 📝 Available Scripts

- `npm run dev` - Run development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run linter

## 🔧 Go Backend Integration

1. Clone Go backend:
```bash
git clone https://github.com/vhvplatform/go-user-service
cd go-user-service
```

2. Run Go backend (port 8080)

3. Update `.env.local` to production mode:
```env
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

4. Restart Next.js app:
```bash
npm run dev
```

## 🔄 Migration from Vite

If you're upgrading from Vite version, see:
- [Migration Guide](../migration/MIGRATION_VITE_TO_NEXTJS.md)

Key changes:
- Environment variables: `VITE_*` → `NEXT_PUBLIC_*`
- Config file: `vite.config.ts` → `next.config.js`
- Env file: `.env` → `.env.local`

## 📞 Support

See README.md for more details about:
- Project structure
- API endpoints
- UI components
- Development guidelines

See also:
- [Quick Start Guide](./QUICKSTART.md)
- [Setup Checklist](./SETUP_CHECKLIST.md)
- [Environment Setup](../environment/ENV_COMPLETE_GUIDE.md)

---

**Happy Coding! 🎉**
