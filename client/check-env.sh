#!/bin/bash

# VHV Platform - Environment Check Script
# Kiểm tra và fix configuration issues

set -e

echo "🔍 VHV Platform - Environment Configuration Checker"
echo "=================================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check 1: .env file exists
echo "📋 Check 1: Checking if .env file exists..."
if [ -f .env ]; then
    echo -e "${GREEN}✓${NC} .env file exists"
else
    echo -e "${RED}✗${NC} .env file NOT found"
    echo ""
    echo -e "${YELLOW}FIX:${NC} Creating .env from .env.example..."
    
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${GREEN}✓${NC} Created .env from .env.example"
    else
        echo -e "${RED}✗${NC} .env.example also not found!"
        echo ""
        echo "Creating basic .env file..."
        cat > .env << 'EOF'
# Environment Configuration
VITE_ENVIRONMENT=local
VITE_API_URL_LOCAL=http://localhost:8080/api/v1
VITE_USE_MOCK_API=true
VITE_ENABLE_DEBUG=true
EOF
        echo -e "${GREEN}✓${NC} Created basic .env file"
    fi
fi

echo ""

# Check 2: VITE_USE_MOCK_API is set
echo "📋 Check 2: Checking VITE_USE_MOCK_API configuration..."
if grep -q "VITE_USE_MOCK_API" .env; then
    VALUE=$(grep "VITE_USE_MOCK_API" .env | cut -d '=' -f2)
    if [ -z "$VALUE" ]; then
        echo -e "${RED}✗${NC} VITE_USE_MOCK_API is set but empty"
        echo ""
        echo -e "${YELLOW}FIX:${NC} Setting VITE_USE_MOCK_API=true..."
        sed -i '' 's/VITE_USE_MOCK_API=.*/VITE_USE_MOCK_API=true/' .env 2>/dev/null || sed -i 's/VITE_USE_MOCK_API=.*/VITE_USE_MOCK_API=true/' .env
        echo -e "${GREEN}✓${NC} Fixed VITE_USE_MOCK_API=true"
    else
        echo -e "${GREEN}✓${NC} VITE_USE_MOCK_API is set to: $VALUE"
    fi
else
    echo -e "${RED}✗${NC} VITE_USE_MOCK_API not found in .env"
    echo ""
    echo -e "${YELLOW}FIX:${NC} Adding VITE_USE_MOCK_API=true..."
    echo "" >> .env
    echo "# Use Mock API (true = mock data, false = real API)" >> .env
    echo "VITE_USE_MOCK_API=true" >> .env
    echo -e "${GREEN}✓${NC} Added VITE_USE_MOCK_API=true"
fi

echo ""

# Check 3: VITE_ENVIRONMENT is set
echo "📋 Check 3: Checking VITE_ENVIRONMENT configuration..."
if grep -q "VITE_ENVIRONMENT" .env; then
    VALUE=$(grep "VITE_ENVIRONMENT" .env | cut -d '=' -f2)
    if [ -z "$VALUE" ]; then
        echo -e "${YELLOW}⚠${NC} VITE_ENVIRONMENT is set but empty"
        echo -e "${YELLOW}FIX:${NC} Setting VITE_ENVIRONMENT=local..."
        sed -i '' 's/VITE_ENVIRONMENT=.*/VITE_ENVIRONMENT=local/' .env 2>/dev/null || sed -i 's/VITE_ENVIRONMENT=.*/VITE_ENVIRONMENT=local/' .env
        echo -e "${GREEN}✓${NC} Fixed VITE_ENVIRONMENT=local"
    else
        echo -e "${GREEN}✓${NC} VITE_ENVIRONMENT is set to: $VALUE"
    fi
else
    echo -e "${YELLOW}⚠${NC} VITE_ENVIRONMENT not found in .env"
    echo -e "${YELLOW}FIX:${NC} Adding VITE_ENVIRONMENT=local..."
    echo "" >> .env
    echo "# Environment: local | dev | staging | production" >> .env
    echo "VITE_ENVIRONMENT=local" >> .env
    echo -e "${GREEN}✓${NC} Added VITE_ENVIRONMENT=local"
fi

echo ""
echo "=================================================="
echo -e "${GREEN}✓ Environment check complete!${NC}"
echo ""

# Show current configuration
echo "📝 Current .env configuration:"
echo "---------------------------------------------------"
cat .env
echo "---------------------------------------------------"
echo ""

# Instructions
echo -e "${BLUE}📚 Next Steps:${NC}"
echo ""
echo "1. ✅ Your .env file is now configured"
echo "2. 🔄 RESTART your dev server:"
echo "   - Stop: Ctrl+C (or Cmd+C on Mac)"
echo "   - Start: npm run dev"
echo ""
echo "3. 🌐 Open browser and check:"
echo "   - No warnings in console"
echo "   - Environment indicator shows 'LOCAL • MOCK'"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT:${NC} Vite only loads .env on startup!"
echo "   You MUST restart the dev server for changes to take effect."
echo ""
echo "=================================================="
