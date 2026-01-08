#!/bin/bash

# ==========================================
# VHV Platform - Setup Script
# ==========================================
# Automatically copies all .example files to working files
# Usage: ./setup.sh [environment]
# Example: ./setup.sh production

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Environment (default: development)
ENV=${1:-development}

echo -e "${BLUE}"
echo "================================================"
echo "  VHV Platform - Setup Script"
echo "  Version: 3.2.0"
echo "  Environment: $ENV"
echo "================================================"
echo -e "${NC}"

# ====================
# Functions
# ====================

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

file_exists() {
    [ -f "$1" ]
}

copy_if_not_exists() {
    local source=$1
    local dest=$2
    
    if file_exists "$source"; then
        if file_exists "$dest"; then
            print_warning "$dest already exists (skipping)"
        else
            cp "$source" "$dest"
            print_success "Created $dest"
        fi
    else
        print_error "$source not found"
    fi
}

# ====================
# Pre-flight Checks
# ====================

echo -e "\n${BLUE}Running pre-flight checks...${NC}\n"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Are you in the project root?"
    exit 1
fi
print_success "Project root directory confirmed"

# Check for Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    exit 1
fi
print_success "Node.js found: $(node --version)"

# Check for pnpm
if ! command -v pnpm &> /dev/null; then
    print_warning "pnpm is not installed. Installing..."
    npm install -g pnpm
fi
print_success "pnpm found: $(pnpm --version)"

# ====================
# Copy Example Files
# ====================

echo -e "\n${BLUE}Copying configuration files...${NC}\n"

# Environment files
if [ "$ENV" = "production" ]; then
    print_info "Setting up PRODUCTION environment"
    copy_if_not_exists ".env.production.example" ".env"
    copy_if_not_exists ".env.production.example" ".env.production"
elif [ "$ENV" = "staging" ]; then
    print_info "Setting up STAGING environment"
    copy_if_not_exists ".env.staging.example" ".env"
    copy_if_not_exists ".env.staging.example" ".env.staging"
else
    print_info "Setting up DEVELOPMENT environment"
    copy_if_not_exists ".env.example" ".env"
    copy_if_not_exists ".env.local.example" ".env.local"
fi

# Docker files
echo -e "\n${BLUE}Setting up Docker files...${NC}\n"
copy_if_not_exists "Dockerfile.example" "Dockerfile"
copy_if_not_exists "docker-compose.example.yml" "docker-compose.yml"
copy_if_not_exists ".dockerignore.example" ".dockerignore"
copy_if_not_exists "nginx.conf.example" "nginx.conf"

# Deployment files
echo -e "\n${BLUE}Setting up deployment files...${NC}\n"
copy_if_not_exists "vercel.json.example" "vercel.json"
copy_if_not_exists "netlify.toml.example" "netlify.toml"

# ====================
# Update .gitignore
# ====================

echo -e "\n${BLUE}Updating .gitignore...${NC}\n"

if file_exists ".gitignore"; then
    # Check if .env is already in .gitignore
    if ! grep -q "^\.env$" .gitignore; then
        echo -e "\n# Environment files\n.env\n.env.local\n.env.*.local" >> .gitignore
        print_success "Added .env to .gitignore"
    else
        print_success ".gitignore already configured"
    fi
else
    print_error ".gitignore not found"
fi

# ====================
# Security Warnings
# ====================

echo -e "\n${YELLOW}================================================${NC}"
echo -e "${YELLOW}  ⚠️  SECURITY WARNINGS ⚠️${NC}"
echo -e "${YELLOW}================================================${NC}\n"

if [ "$ENV" = "production" ]; then
    echo -e "${RED}CRITICAL: Before deploying to production:${NC}"
    echo -e "  1. ${YELLOW}Change VITE_TOKEN_ENCRYPTION_KEY${NC} to a random 32-char string"
    echo -e "  2. ${YELLOW}Set VITE_FORCE_HTTPS=true${NC}"
    echo -e "  3. ${YELLOW}Set VITE_DEBUG_MODE=false${NC}"
    echo -e "  4. ${YELLOW}Update all URLs to production domains${NC}"
    echo -e "  5. ${YELLOW}Review all environment variables${NC}"
    echo -e "  6. ${YELLOW}Run security scan: pnpm audit${NC}"
    echo -e ""
fi

echo -e "${YELLOW}Remember:${NC}"
echo -e "  • ${RED}NEVER commit .env files to git${NC}"
echo -e "  • Update configuration files with your actual values"
echo -e "  • Store production secrets in secure vaults"
echo -e "  • Review SECURITY_GUIDE.md for best practices"

# ====================
# Next Steps
# ====================

echo -e "\n${BLUE}================================================${NC}"
echo -e "${BLUE}  ✓ Setup Complete!${NC}"
echo -e "${BLUE}================================================${NC}\n"

echo -e "${GREEN}Next steps:${NC}\n"

if [ "$ENV" = "production" ]; then
    echo "  1. Edit .env.production with your production values"
    echo "  2. Review security checklist in SECURITY_GUIDE.md"
    echo "  3. Run: pnpm ci (test everything)"
    echo "  4. Deploy: Follow deployment guide in README.md"
else
    echo "  1. Edit .env with your development values"
    echo "  2. Install dependencies: pnpm install"
    echo "  3. Start development server: pnpm dev"
    echo "  4. Open http://localhost:5173"
fi

echo -e "\n${BLUE}Useful commands:${NC}\n"
echo "  pnpm dev          - Start development server"
echo "  pnpm build        - Build for production"
echo "  pnpm test         - Run tests"
echo "  pnpm lint         - Check code quality"
echo "  pnpm ci           - Run all checks"

echo -e "\n${BLUE}Documentation:${NC}\n"
echo "  README.md                - Getting started guide"
echo "  ONBOARDING.md           - Developer onboarding"
echo "  SECURITY_GUIDE.md       - Security documentation"
echo "  EXAMPLE_FILES_GUIDE.md  - Configuration reference"

echo -e "\n${GREEN}Happy coding! 🚀${NC}\n"

# ====================
# Optional: Install dependencies
# ====================

read -p "$(echo -e ${BLUE}Do you want to install dependencies now? [y/N]: ${NC})" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "\n${BLUE}Installing dependencies...${NC}\n"
    pnpm install
    print_success "Dependencies installed!"
    
    echo -e "\n${GREEN}Ready to start! Run: pnpm dev${NC}\n"
fi
