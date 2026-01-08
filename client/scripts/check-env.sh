#!/bin/bash
# ==================================
# Environment Variables Checker
# ==================================
# Checks if all required environment variables are set

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  VHV Platform - Environment Check${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ Error: .env file not found${NC}"
    echo -e "${YELLOW}💡 Run: cp .env.example .env${NC}"
    exit 1
fi

echo -e "${GREEN}✅ .env file found${NC}"
echo ""

# Required variables
REQUIRED_VARS=(
    "VITE_TENANT_ID"
    "VITE_API_BASE_URL"
    "VITE_USER_SERVICE_URL"
    "VITE_TOKEN_ENCRYPTION_KEY"
)

# Optional but recommended
RECOMMENDED_VARS=(
    "VITE_TENANT_NAME"
    "VITE_AUTH_SERVICE_URL"
    "VITE_APP_VERSION"
    "VITE_APP_ENV"
)

# Check required variables
echo -e "${BLUE}Checking REQUIRED variables...${NC}"
MISSING_REQUIRED=0

for var in "${REQUIRED_VARS[@]}"; do
    if grep -q "^${var}=" .env && ! grep -q "^${var}=$" .env; then
        VALUE=$(grep "^${var}=" .env | cut -d'=' -f2)
        if [ -n "$VALUE" ]; then
            echo -e "${GREEN}✅ ${var}${NC}"
        else
            echo -e "${RED}❌ ${var} is empty${NC}"
            MISSING_REQUIRED=1
        fi
    else
        echo -e "${RED}❌ ${var} not found or empty${NC}"
        MISSING_REQUIRED=1
    fi
done

echo ""

# Check recommended variables
echo -e "${BLUE}Checking RECOMMENDED variables...${NC}"
MISSING_RECOMMENDED=0

for var in "${RECOMMENDED_VARS[@]}"; do
    if grep -q "^${var}=" .env && ! grep -q "^${var}=$" .env; then
        VALUE=$(grep "^${var}=" .env | cut -d'=' -f2)
        if [ -n "$VALUE" ]; then
            echo -e "${GREEN}✅ ${var}${NC}"
        else
            echo -e "${YELLOW}⚠️  ${var} is empty (recommended)${NC}"
            MISSING_RECOMMENDED=1
        fi
    else
        echo -e "${YELLOW}⚠️  ${var} not found (recommended)${NC}"
        MISSING_RECOMMENDED=1
    fi
done

echo ""

# Security checks
echo -e "${BLUE}Security checks...${NC}"

# Check encryption key length
if grep -q "^VITE_TOKEN_ENCRYPTION_KEY=" .env; then
    KEY=$(grep "^VITE_TOKEN_ENCRYPTION_KEY=" .env | cut -d'=' -f2)
    KEY_LENGTH=${#KEY}
    
    if [ $KEY_LENGTH -lt 32 ]; then
        echo -e "${RED}❌ VITE_TOKEN_ENCRYPTION_KEY is too short (${KEY_LENGTH} chars, need 32+)${NC}"
    else
        echo -e "${GREEN}✅ VITE_TOKEN_ENCRYPTION_KEY length OK (${KEY_LENGTH} chars)${NC}"
    fi
    
    # Check if using default value
    if [ "$KEY" == "your-encryption-key" ] || [ "$KEY" == "dev-key-change-in-production-32c" ]; then
        echo -e "${YELLOW}⚠️  WARNING: Using default encryption key - CHANGE THIS!${NC}"
    fi
fi

# Check HTTPS enforcement
if grep -q "^VITE_FORCE_HTTPS=false" .env; then
    ENV=$(grep "^VITE_APP_ENV=" .env | cut -d'=' -f2)
    if [ "$ENV" == "production" ]; then
        echo -e "${RED}❌ VITE_FORCE_HTTPS should be true in production${NC}"
    else
        echo -e "${GREEN}✅ VITE_FORCE_HTTPS=false OK for ${ENV}${NC}"
    fi
else
    echo -e "${GREEN}✅ HTTPS enforcement enabled${NC}"
fi

# Check debug mode
if grep -q "^VITE_DEBUG_MODE=true" .env; then
    ENV=$(grep "^VITE_APP_ENV=" .env | cut -d'=' -f2)
    if [ "$ENV" == "production" ]; then
        echo -e "${YELLOW}⚠️  WARNING: Debug mode enabled in production${NC}"
    else
        echo -e "${GREEN}✅ Debug mode OK for ${ENV}${NC}"
    fi
fi

echo ""

# Summary
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Summary${NC}"
echo -e "${BLUE}========================================${NC}"

if [ $MISSING_REQUIRED -eq 0 ]; then
    echo -e "${GREEN}✅ All required variables are set${NC}"
else
    echo -e "${RED}❌ Some required variables are missing${NC}"
fi

if [ $MISSING_RECOMMENDED -eq 0 ]; then
    echo -e "${GREEN}✅ All recommended variables are set${NC}"
else
    echo -e "${YELLOW}⚠️  Some recommended variables are missing${NC}"
fi

echo ""

# Exit code
if [ $MISSING_REQUIRED -eq 0 ]; then
    echo -e "${GREEN}✅ Environment configuration is valid${NC}"
    exit 0
else
    echo -e "${RED}❌ Please fix the missing required variables${NC}"
    echo -e "${YELLOW}💡 See ENVIRONMENT_VARIABLES.md for details${NC}"
    exit 1
fi
