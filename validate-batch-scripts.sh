#!/bin/bash
# Batch script validation for Linux/macOS
# This script performs basic validation of Windows batch files

echo "Validating Windows batch scripts..."
echo

errors=0
warnings=0

# List of batch files to validate
batch_files=(
    "build.bat"
    "test.bat"
    "run.bat"
    "clean.bat"
    "lint.bat"
    "fmt.bat"
    "deps.bat"
    "install-tools.bat"
)

# Check if batch files exist
echo "1. Checking if batch files exist..."
for file in "${batch_files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file exists"
    else
        echo "  ✗ $file is missing"
        ((errors++))
    fi
done
echo

# Check for correct line endings (CRLF is optional but common for batch files)
echo "2. Checking file encodings..."
for file in "${batch_files[@]}"; do
    if [ -f "$file" ]; then
        # Check if file has any content
        if [ -s "$file" ]; then
            echo "  ✓ $file has content"
        else
            echo "  ⚠ $file is empty"
            ((warnings++))
        fi
    fi
done
echo

# Check for common batch script syntax
echo "3. Checking batch script syntax..."
for file in "${batch_files[@]}"; do
    if [ -f "$file" ]; then
        # Check for @echo off
        if grep -q "@echo off" "$file"; then
            echo "  ✓ $file has @echo off"
        else
            echo "  ⚠ $file missing @echo off"
            ((warnings++))
        fi
        
        # Check for Windows path separators (backslashes)
        if grep -qE "(bin\\\\|cmd\\\\|\\.\\\\)" "$file" 2>/dev/null; then
            echo "  ✓ $file uses Windows path separators"
        fi
        
        # Check for proper exit codes
        if grep -qE "(exit /b|ERRORLEVEL)" "$file"; then
            echo "  ✓ $file has error handling"
        fi
    fi
done
echo

# Check for common issues
echo "4. Checking for common issues..."
for file in "${batch_files[@]}"; do
    if [ -f "$file" ]; then
        # Check for Unix-style paths (potential issue)
        if grep -qE "[^\\\\]/[a-zA-Z]" "$file"; then
            echo "  ⚠ $file may contain Unix-style paths"
            ((warnings++))
        fi
        
        # Check for Unix-style commands that won't work on Windows
        if grep -qE "(rm -rf|mkdir -p)" "$file"; then
            echo "  ✗ $file contains Unix-style commands"
            ((errors++))
        fi
    fi
done
echo

# Summary
echo "======================================"
echo "Validation Summary"
echo "======================================"
echo "Batch files validated: ${#batch_files[@]}"
echo "Errors: $errors"
echo "Warnings: $warnings"
echo

if [ $errors -eq 0 ] && [ $warnings -eq 0 ]; then
    echo "✓ All batch scripts passed validation!"
    exit 0
elif [ $errors -eq 0 ]; then
    echo "⚠ Batch scripts passed with warnings"
    exit 0
else
    echo "✗ Batch scripts validation failed"
    exit 1
fi
