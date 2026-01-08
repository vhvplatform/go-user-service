#!/bin/bash

# ==============================================================================
# VHV PLATFORM - QUICK SETUP SCRIPT
# ==============================================================================
# Version: 3.2.0
# Purpose: Quick setup for first-time developers
# Usage: bash scripts/quick-setup.sh
# ==============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

clear

echo -e "${CYAN}"
cat << "EOF"
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║              VHV PLATFORM - QUICK SETUP                        ║
║                    Version 3.2.0                               ║
║                                                                ║
║         Microservices Management Platform                      ║
║              React + Vite + Supabase                           ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo ""
echo -e "${BLUE}This script will help you set up the development environment.${NC}"
echo ""
sleep 1

# ==============================================================================
# STEP 1: Check Prerequisites
# ==============================================================================
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Step 1: Checking Prerequisites${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo ""

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js is installed: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js is not installed"
    echo "  Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check PNPM
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm --version)
    echo -e "${GREEN}✓${NC} PNPM is installed: v$PNPM_VERSION"
else
    echo -e "${YELLOW}⚠${NC} PNPM is not installed"
    echo ""
    read -p "Do you want to install PNPM now? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Installing PNPM..."
        npm install -g pnpm
        echo -e "${GREEN}✓${NC} PNPM installed successfully"
    else
        echo -e "${RED}✗${NC} PNPM is required. Exiting."
        exit 1
    fi
fi

# Check Git
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version | cut -d ' ' -f 3)
    echo -e "${GREEN}✓${NC} Git is installed: v$GIT_VERSION"
else
    echo -e "${YELLOW}⚠${NC} Git is not installed (optional for local dev)"
fi

echo ""
sleep 1

# ==============================================================================
# STEP 2: Copy Environment File
# ==============================================================================
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Step 2: Setting Up Environment File${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo ""

if [ -f ".env" ]; then
    echo -e "${YELLOW}⚠${NC} .env file already exists"
    read -p "Do you want to overwrite it? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cp .env.example .env
        echo -e "${GREEN}✓${NC} .env file created from template"
    else
        echo -e "${YELLOW}→${NC} Keeping existing .env file"
    fi
else
    cp .env.example .env
    echo -e "${GREEN}✓${NC} .env file created from template"
fi

echo ""
sleep 1

# ==============================================================================
# STEP 3: Configure Supabase
# ==============================================================================
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Step 3: Configure Supabase (Optional)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo ""

echo "Do you have Supabase credentials ready?"
echo "  1) Yes, I have them"
echo "  2) No, I'll configure later"
echo "  3) Help me get Supabase credentials"
echo ""
read -p "Your choice (1-3): " -n 1 -r
echo ""

case $REPLY in
    1)
        echo ""
        read -p "Enter your Supabase URL: " SUPABASE_URL
        read -p "Enter your Supabase Anon Key: " SUPABASE_ANON_KEY
        
        # Update .env file
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s|VITE_SUPABASE_URL=.*|VITE_SUPABASE_URL=$SUPABASE_URL|g" .env
            sed -i '' "s|VITE_SUPABASE_ANON_KEY=.*|VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY|g" .env
        else
            # Linux
            sed -i "s|VITE_SUPABASE_URL=.*|VITE_SUPABASE_URL=$SUPABASE_URL|g" .env
            sed -i "s|VITE_SUPABASE_ANON_KEY=.*|VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY|g" .env
        fi
        
        echo -e "${GREEN}✓${NC} Supabase credentials configured"
        ;;
    2)
        echo -e "${YELLOW}→${NC} You can configure Supabase later in .env file"
        ;;
    3)
        echo ""
        echo -e "${CYAN}To get Supabase credentials:${NC}"
        echo "  1. Go to https://app.supabase.com"
        echo "  2. Sign in or create account"
        echo "  3. Create new project"
        echo "  4. Go to Settings → API"
        echo "  5. Copy 'URL' and 'anon public' key"
        echo "  6. Edit .env file and paste them"
        echo ""
        read -p "Press Enter to continue..."
        ;;
esac

echo ""
sleep 1

# ==============================================================================
# STEP 4: Install Dependencies
# ==============================================================================
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Step 4: Installing Dependencies${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo ""

if [ -d "node_modules" ]; then
    echo -e "${YELLOW}⚠${NC} node_modules already exists"
    read -p "Do you want to reinstall dependencies? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Removing old node_modules..."
        rm -rf node_modules
        echo "Installing dependencies with PNPM..."
        pnpm install
        echo -e "${GREEN}✓${NC} Dependencies installed"
    else
        echo -e "${YELLOW}→${NC} Skipping dependency installation"
    fi
else
    echo "Installing dependencies with PNPM..."
    pnpm install
    echo -e "${GREEN}✓${NC} Dependencies installed"
fi

echo ""
sleep 1

# ==============================================================================
# STEP 5: Verify Setup
# ==============================================================================
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Step 5: Verifying Setup${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo ""

echo "Running verification checks..."
echo ""

# Check if .env exists
if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} .env file exists"
else
    echo -e "${RED}✗${NC} .env file missing"
fi

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules exists"
else
    echo -e "${RED}✗${NC} node_modules missing"
fi

# Check if pnpm-lock.yaml exists
if [ -f "pnpm-lock.yaml" ]; then
    echo -e "${GREEN}✓${NC} pnpm-lock.yaml exists"
else
    echo -e "${YELLOW}⚠${NC} pnpm-lock.yaml missing"
fi

# Check if .gitignore exists
if [ -f ".gitignore" ]; then
    echo -e "${GREEN}✓${NC} .gitignore exists"
else
    echo -e "${YELLOW}⚠${NC} .gitignore missing"
fi

echo ""
sleep 1

# ==============================================================================
# STEP 6: Summary & Next Steps
# ==============================================================================
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✓ Setup Complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""

echo -e "${CYAN}📋 Next Steps:${NC}"
echo ""
echo "1. Configure your environment (if not done yet):"
echo -e "   ${YELLOW}nano .env${NC}"
echo ""
echo "2. Start development server:"
echo -e "   ${YELLOW}pnpm dev${NC}"
echo ""
echo "3. Open in browser:"
echo -e "   ${YELLOW}http://localhost:5173${NC}"
echo ""
echo "4. Build for production:"
echo -e "   ${YELLOW}pnpm build${NC}"
echo ""

echo -e "${CYAN}📚 Documentation:${NC}"
echo ""
echo "  • ENV_COMPLETE_GUIDE.md    - Full environment guide"
echo "  • ENV_FILES_LOCATION.md    - Environment files reference"
echo "  • PNPM_GUIDE.md            - PNPM usage guide"
echo "  • SECURITY_GUIDE.md        - Security best practices"
echo ""

echo -e "${CYAN}🔧 Useful Commands:${NC}"
echo ""
echo "  pnpm dev              - Start dev server"
echo "  pnpm build            - Build for production"
echo "  pnpm preview          - Preview production build"
echo "  pnpm lint             - Run linter"
echo "  pnpm test             - Run tests"
echo ""

echo -e "${CYAN}🆘 Need Help?${NC}"
echo ""
echo "  • Documentation: Read guides in project root"
echo "  • Slack: #vhv-platform-support"
echo "  • Email: dev-team@vhvplatform.com"
echo ""

read -p "Do you want to start the dev server now? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${GREEN}Starting development server...${NC}"
    echo ""
    pnpm dev
else
    echo ""
    echo -e "${GREEN}Setup complete! Run 'pnpm dev' when ready.${NC}"
    echo ""
fi
