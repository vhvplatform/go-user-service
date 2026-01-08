#!/bin/bash

# VHV Platform - File Checker Script
# Kiểm tra xem tất cả files cần thiết đã có chưa

echo "🔍 VHV Platform - File Checker"
echo "================================"
echo ""

MISSING_FILES=0
TOTAL_FILES=0

check_file() {
  TOTAL_FILES=$((TOTAL_FILES + 1))
  if [ -f "$1" ]; then
    echo "✅ $1"
  else
    echo "❌ MISSING: $1"
    MISSING_FILES=$((MISSING_FILES + 1))
  fi
}

check_dir() {
  TOTAL_FILES=$((TOTAL_FILES + 1))
  if [ -d "$1" ]; then
    echo "✅ $1/"
  else
    echo "❌ MISSING: $1/"
    MISSING_FILES=$((MISSING_FILES + 1))
  fi
}

echo "📋 Checking root files..."
check_file "package.json"
check_file "vite.config.ts"
check_file "tsconfig.json"
check_file "postcss.config.mjs"
check_file "index.html"
check_file ".env"
check_file "README.md"

echo ""
echo "📂 Checking directories..."
check_dir "src"
check_dir "src/app"
check_dir "src/app/components"
check_dir "src/services"
check_dir "src/styles"

echo ""
echo "📄 Checking source files..."
check_file "src/main.tsx"
check_file "src/app/App.tsx"
check_file "src/app/components/Header.tsx"
check_file "src/app/components/Sidebar.tsx"
check_file "src/app/components/Dashboard.tsx"
check_file "src/app/components/UserManagement.tsx"
check_file "src/app/components/UserModal.tsx"
check_file "src/services/api.ts"
check_file "src/services/mockData.ts"
check_file "src/styles/index.css"
check_file "src/styles/theme.css"

echo ""
echo "================================"
echo "📊 Summary:"
echo "   Total checked: $TOTAL_FILES"
echo "   Missing: $MISSING_FILES"
echo ""

if [ $MISSING_FILES -eq 0 ]; then
  echo "🎉 All required files are present!"
  echo "   Ready to run: npm install && npm run dev"
else
  echo "⚠️  $MISSING_FILES file(s) missing!"
  echo "   Please check DOWNLOAD_GUIDE.md for instructions"
fi

echo ""
