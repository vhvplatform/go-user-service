#!/bin/bash

# ==============================================================================
# VHV PLATFORM - ENVIRONMENT SETUP VERIFICATION SCRIPT
# ==============================================================================
# Version: 3.2.0
# Purpose: Verify environment files are correctly set up
# Usage: bash scripts/verify-env-setup.sh
# ==============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASS=0
FAIL=0
WARN=0

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   VHV Platform - Environment Verification     ║${NC}"
echo -e "${BLUE}║              Version 3.2.0                     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

# Function to print section header
print_section() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
    echo ""
}

# Function to print success
print_success() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASS++))
}

# Function to print error
print_error() {
    echo -e "${RED}✗${NC} $1"
    ((FAIL++))
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARN++))
}

# ==============================================================================
# 1. CHECK EXAMPLE FILES
# ==============================================================================
print_section "1. Checking Environment Example Files"

if [ -f ".env.example" ]; then
    print_success ".env.example exists"
else
    print_error ".env.example NOT FOUND"
fi

if [ -f ".env.dev-shared.example" ]; then
    print_success ".env.dev-shared.example exists"
else
    print_error ".env.dev-shared.example NOT FOUND"
fi

if [ -f ".env.staging.example" ]; then
    print_success ".env.staging.example exists"
else
    print_error ".env.staging.example NOT FOUND"
fi

if [ -f ".env.production.example" ]; then
    print_success ".env.production.example exists"
else
    print_error ".env.production.example NOT FOUND"
fi

# ==============================================================================
# 2. CHECK .GITIGNORE
# ==============================================================================
print_section "2. Checking .gitignore Configuration"

if [ -f ".gitignore" ]; then
    print_success ".gitignore exists"
    
    # Check if .env is in .gitignore
    if grep -q "^\.env$" .gitignore; then
        print_success ".env is ignored in .gitignore"
    else
        print_error ".env is NOT in .gitignore"
    fi
    
    # Check if .env.local is in .gitignore
    if grep -q "\.env\.local" .gitignore; then
        print_success ".env.local pattern is in .gitignore"
    else
        print_warning ".env.local pattern not found in .gitignore"
    fi
else
    print_error ".gitignore NOT FOUND"
fi

# ==============================================================================
# 3. CHECK LOCAL .ENV FILE
# ==============================================================================
print_section "3. Checking Local .env File"

if [ -f ".env" ]; then
    print_success ".env file exists"
    
    # Check if .env is tracked by git
    if git ls-files --error-unmatch .env 2>/dev/null; then
        print_error ".env is TRACKED by git (SECURITY RISK!)"
        echo "         Run: git rm --cached .env"
    else
        print_success ".env is NOT tracked by git"
    fi
    
    # Check required variables
    echo ""
    echo "   Checking required variables..."
    
    if grep -q "^VITE_APP_ENV=" .env; then
        print_success "VITE_APP_ENV is set"
    else
        print_error "VITE_APP_ENV is missing"
    fi
    
    if grep -q "^VITE_API_BASE_URL=" .env; then
        print_success "VITE_API_BASE_URL is set"
    else
        print_error "VITE_API_BASE_URL is missing"
    fi
    
    if grep -q "^VITE_SUPABASE_URL=" .env; then
        value=$(grep "^VITE_SUPABASE_URL=" .env | cut -d '=' -f2)
        if [[ "$value" == *"your-project"* ]]; then
            print_warning "VITE_SUPABASE_URL needs to be configured"
        else
            print_success "VITE_SUPABASE_URL is configured"
        fi
    else
        print_error "VITE_SUPABASE_URL is missing"
    fi
    
    if grep -q "^VITE_SUPABASE_ANON_KEY=" .env; then
        value=$(grep "^VITE_SUPABASE_ANON_KEY=" .env | cut -d '=' -f2)
        if [[ "$value" == *"your-"* ]] || [[ "$value" == *"-here"* ]]; then
            print_warning "VITE_SUPABASE_ANON_KEY needs to be configured"
        else
            print_success "VITE_SUPABASE_ANON_KEY is configured"
        fi
    else
        print_error "VITE_SUPABASE_ANON_KEY is missing"
    fi
else
    print_warning ".env file does not exist (copy from .env.example)"
    echo "         Run: cp .env.example .env"
fi

# ==============================================================================
# 4. CHECK GIT STATUS
# ==============================================================================
print_section "4. Checking Git Status"

# Check if any .env files are staged
staged_env_files=$(git diff --cached --name-only | grep "\.env$" || true)
if [ -z "$staged_env_files" ]; then
    print_success "No .env files are staged for commit"
else
    print_error "WARNING: .env files are staged:"
    echo "$staged_env_files"
    echo "         Run: git reset HEAD .env"
fi

# Check if git check-ignore works for .env
if git check-ignore -q .env; then
    print_success ".env is properly ignored by git"
else
    if [ -f ".env" ]; then
        print_warning ".env exists but may not be ignored"
    fi
fi

# ==============================================================================
# 5. CHECK PNPM
# ==============================================================================
print_section "5. Checking PNPM Installation"

if command -v pnpm &> /dev/null; then
    pnpm_version=$(pnpm --version)
    print_success "PNPM is installed (v$pnpm_version)"
    
    if [ -f "pnpm-lock.yaml" ]; then
        print_success "pnpm-lock.yaml exists"
    else
        print_warning "pnpm-lock.yaml not found (run: pnpm install)"
    fi
    
    if [ -d "node_modules" ]; then
        print_success "node_modules directory exists"
    else
        print_warning "node_modules not found (run: pnpm install)"
    fi
else
    print_warning "PNPM is not installed"
    echo "         Install: npm install -g pnpm"
fi

# ==============================================================================
# 6. CHECK PACKAGE.JSON
# ==============================================================================
print_section "6. Checking package.json"

if [ -f "package.json" ]; then
    print_success "package.json exists"
    
    # Check if scripts are defined
    if grep -q "\"dev\":" package.json; then
        print_success "dev script is defined"
    else
        print_warning "dev script not found"
    fi
    
    if grep -q "\"build\":" package.json; then
        print_success "build script is defined"
    else
        print_warning "build script not found"
    fi
else
    print_error "package.json NOT FOUND"
fi

# ==============================================================================
# 7. CHECK VITE CONFIG
# ==============================================================================
print_section "7. Checking Vite Configuration"

if [ -f "vite.config.ts" ] || [ -f "vite.config.js" ]; then
    print_success "Vite config exists"
else
    print_error "Vite config NOT FOUND"
fi

# ==============================================================================
# 8. CHECK DOCUMENTATION
# ==============================================================================
print_section "8. Checking Documentation"

docs=(
    "ENV_COMPLETE_GUIDE.md"
    "ENV_FILES_LOCATION.md"
    "PNPM_GUIDE.md"
    "SECURITY_GUIDE.md"
)

for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        print_success "$doc exists"
    else
        print_warning "$doc not found"
    fi
done

# ==============================================================================
# 9. SUMMARY
# ==============================================================================
print_section "Summary"

TOTAL=$((PASS + FAIL + WARN))

echo ""
echo -e "${GREEN}✓ PASSED: $PASS${NC}"
echo -e "${YELLOW}⚠ WARNINGS: $WARN${NC}"
echo -e "${RED}✗ FAILED: $FAIL${NC}"
echo -e "   TOTAL: $TOTAL"
echo ""

if [ $FAIL -eq 0 ] && [ $WARN -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║     ✓ ALL CHECKS PASSED!                      ║${NC}"
    echo -e "${GREEN}║     Environment is properly configured         ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"
    exit 0
elif [ $FAIL -eq 0 ]; then
    echo -e "${YELLOW}╔════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║     ⚠ CHECKS PASSED WITH WARNINGS            ║${NC}"
    echo -e "${YELLOW}║     Please review warnings above               ║${NC}"
    echo -e "${YELLOW}╚════════════════════════════════════════════════╝${NC}"
    exit 0
else
    echo -e "${RED}╔════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║     ✗ SOME CHECKS FAILED                      ║${NC}"
    echo -e "${RED}║     Please fix errors above                    ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════╝${NC}"
    exit 1
fi
