@echo off
REM ==================================
REM Environment Variables Checker (Windows)
REM ==================================
REM Checks if all required environment variables are set

setlocal enabledelayedexpansion

echo ========================================
echo   VHV Platform - Environment Check
echo ========================================
echo.

REM Check if .env file exists
if not exist ".env" (
    echo [ERROR] .env file not found
    echo [INFO] Run: copy .env.example .env
    exit /b 1
)

echo [OK] .env file found
echo.

REM Check required variables
echo Checking REQUIRED variables...

set "MISSING=0"

REM VITE_TENANT_ID
findstr /B "VITE_TENANT_ID=" .env >nul
if %errorlevel%==0 (
    echo [OK] VITE_TENANT_ID
) else (
    echo [ERROR] VITE_TENANT_ID not found
    set "MISSING=1"
)

REM VITE_API_BASE_URL
findstr /B "VITE_API_BASE_URL=" .env >nul
if %errorlevel%==0 (
    echo [OK] VITE_API_BASE_URL
) else (
    echo [ERROR] VITE_API_BASE_URL not found
    set "MISSING=1"
)

REM VITE_USER_SERVICE_URL
findstr /B "VITE_USER_SERVICE_URL=" .env >nul
if %errorlevel%==0 (
    echo [OK] VITE_USER_SERVICE_URL
) else (
    echo [ERROR] VITE_USER_SERVICE_URL not found
    set "MISSING=1"
)

REM VITE_TOKEN_ENCRYPTION_KEY
findstr /B "VITE_TOKEN_ENCRYPTION_KEY=" .env >nul
if %errorlevel%==0 (
    echo [OK] VITE_TOKEN_ENCRYPTION_KEY
) else (
    echo [ERROR] VITE_TOKEN_ENCRYPTION_KEY not found
    set "MISSING=1"
)

echo.

REM Summary
echo ========================================
echo   Summary
echo ========================================

if "%MISSING%"=="0" (
    echo [OK] All required variables are set
    echo.
    echo [SUCCESS] Environment configuration is valid
    exit /b 0
) else (
    echo [ERROR] Some required variables are missing
    echo [INFO] See ENVIRONMENT_VARIABLES.md for details
    exit /b 1
)
