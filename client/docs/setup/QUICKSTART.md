# 🚀 Quick Start Guide

Get VHV Platform up and running in 5 minutes!

## ⚡ Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0 (or pnpm/yarn)
- Git (optional, for cloning)

## 📦 Installation

### Option 1: Clone from GitHub

```bash
# Clone repository
git clone https://github.com/vhvplatform/frontend.git
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.local.example .env.local

# Start development server
npm run dev
```

### Option 2: Download ZIP

1. Download the latest release
2. Extract to your desired location
3. Open terminal in the extracted folder
4. Run:

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

## 🎯 First Time Setup

### 1. Environment Configuration

The `.env.local.example` file is already configured for local development:

```env
NEXT_PUBLIC_ENVIRONMENT=local
NEXT_PUBLIC_USE_MOCK_API=true
```

This means:
- ✅ Uses mock data (60+ sample users)
- ✅ No backend required
- ✅ Ready to use immediately

### 2. Start Development Server

```bash
npm run dev
```

Open your browser and navigate to: **http://localhost:3000**

### 3. Default Login (Mock Mode)

Use any of these test accounts:

**Admin Account:**
```
Email: admin@vhvplatform.com
Password: admin123
```

**Regular User:**
```
Email: user@vhvplatform.com
Password: user123
```

## 🎨 Explore Features

After logging in, you can:

1. **Dashboard** - View system overview with charts
2. **User Management** - Browse, search, and manage users
3. **Analytics** - View analytics and reports
4. **Settings** - Configure your preferences
5. **Profile** - Manage your profile

## 🔄 Connect to Real API

To connect to your Go backend:

### 1. Update Environment

Edit `.env.local`:

```env
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

### 2. Restart Server

⚠️ **Important**: Next.js requires restart after env changes!

```bash
# Stop server (Ctrl+C)
# Then restart
npm run dev
```

### 3. Ensure Backend is Running

Make sure your Go backend is running on port 8080:

```bash
# In your backend directory
cd go-user-service
go run main.go
```

## 🛠️ Common Commands

```bash
# Development
npm run dev              # Start dev server (port 3000)
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # TypeScript checking
npm test                 # Run tests

# Utilities
npm run clean            # Clean build files
```

## ✅ Verify Installation

### Check 1: Development Server

Visit http://localhost:3000 - you should see the login page.

### Check 2: Environment Panel

Look for the "Environment Panel" in the bottom-right corner:
- Should show: Environment: local
- Should show: Mock API: Enabled

### Check 3: Login

Try logging in with test credentials. You should see the dashboard.

### Check 4: User Management

Navigate to User Management - you should see 60+ mock users.

## 🎓 Next Steps

### Learn More

- 📖 [Full Installation Guide](./INSTALL.md) - Detailed setup
- ⚙️ [Environment Configuration](../environment/COMPLETE_GUIDE.md) - All env vars
- 🔌 [API Integration](../api/INTEGRATION_GUIDE.md) - Connect to backend
- 🔒 [Security Setup](../security/IMPLEMENTATION_GUIDE.md) - Secure your app

### Customize

- Change theme colors in `/src/styles/theme.css`
- Add your logo in `/src/app/components/Header.tsx`
- Configure company name in `.env.local`

### Deploy

- 📦 [Build for Production](../deployment/GUIDE.md)
- ☁️ Deploy to Vercel, Netlify, or your server

## 🐛 Troubleshooting

### Port 3000 Already in Use

```bash
# Use different port
PORT=3001 npm run dev
```

### Environment Variables Not Loading

```bash
# Restart server after .env.local changes
# Press Ctrl+C then run:
npm run dev
```

### Dependencies Error

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### "Module not found" Error

```bash
# Ensure all dependencies are installed
npm install

# Clear Next.js cache
rm -rf .next
npm run dev
```

## 📞 Need Help?

- 📖 [Full Documentation](../README.md)
- 🔍 [Troubleshooting Guide](../troubleshooting/GUIDE.md)
- 💬 [GitHub Discussions](https://github.com/vhvplatform/frontend/discussions)
- 🐛 [Report Issues](https://github.com/vhvplatform/frontend/issues)

## 🎉 You're All Set!

Congratulations! VHV Platform is now running on your machine.

**What's Next?**

1. Explore the dashboard
2. Test user management features
3. Configure your environment
4. Connect to your backend API
5. Customize the design
6. Deploy to production

---

**Happy Coding! 🚀**

[Back to Main README](../../README.md) | [View All Documentation](../README.md)
