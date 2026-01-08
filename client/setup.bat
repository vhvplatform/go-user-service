@echo off
REM ==========================================
REM VHV Platform - Setup Script (Windows)
REM ==========================================
REM Automatically copies all .example files to working files
REM Usage: setup.bat [environment]
REM Example: setup.bat production

setlocal enabledelayedexpansion

REM Environment (default: development)
set ENV=%1
if "%ENV%"=="" set ENV=development

echo.
echo ================================================
echo   VHV Platform - Setup Script (Windows)
echo   Version: 3.2.0
echo   Environment: %ENV%
echo ================================================
echo.

REM ====================
REM Pre-flight Checks
REM ====================

echo Running pre-flight checks...
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo [ERROR] package.json not found. Are you in the project root?
    pause
    exit /b 1
)
echo [OK] Project root directory confirmed

REM Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not installed
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)
echo [OK] Node.js found

REM Check for pnpm
where pnpm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [WARNING] pnpm is not installed. Installing...
    npm install -g pnpm
)
echo [OK] pnpm found

REM ====================
REM Copy Example Files
REM ====================

echo.
echo Copying configuration files...
echo.

REM Function to copy file if not exists
call :CopyFile ".env.example" ".env"

if "%ENV%"=="production" (
    echo [INFO] Setting up PRODUCTION environment
    call :CopyFile ".env.production.example" ".env.production"
) else if "%ENV%"=="staging" (
    echo [INFO] Setting up STAGING environment
    call :CopyFile ".env.staging.example" ".env.staging"
) else (
    echo [INFO] Setting up DEVELOPMENT environment
    call :CopyFile ".env.local.example" ".env.local"
)

REM Docker files
echo.
echo Setting up Docker files...
echo.
call :CopyFile "Dockerfile.example" "Dockerfile"
call :CopyFile "docker-compose.example.yml" "docker-compose.yml"
call :CopyFile ".dockerignore.example" ".dockerignore"
call :CopyFile "nginx.conf.example" "nginx.conf"

REM Deployment files
echo.
echo Setting up deployment files...
echo.
call :CopyFile "vercel.json.example" "vercel.json"
call :CopyFile "netlify.toml.example" "netlify.toml"

REM ====================
REM Update .gitignore
REM ====================

echo.
echo Updating .gitignore...
echo.

if exist ".gitignore" (
    findstr /C:".env" .gitignore >nul
    if !ERRORLEVEL! neq 0 (
        echo. >> .gitignore
        echo # Environment files >> .gitignore
        echo .env >> .gitignore
        echo .env.local >> .gitignore
        echo .env.*.local >> .gitignore
        echo [OK] Added .env to .gitignore
    ) else (
        echo [OK] .gitignore already configured
    )
) else (
    echo [ERROR] .gitignore not found
)

REM ====================
REM Security Warnings
REM ====================

echo.
echo ================================================
echo   WARNING: SECURITY WARNINGS
echo ================================================
echo.

if "%ENV%"=="production" (
    echo [CRITICAL] Before deploying to production:
    echo   1. Change VITE_TOKEN_ENCRYPTION_KEY to a random 32-char string
    echo   2. Set VITE_FORCE_HTTPS=true
    echo   3. Set VITE_DEBUG_MODE=false
    echo   4. Update all URLs to production domains
    echo   5. Review all environment variables
    echo   6. Run security scan: pnpm audit
    echo.
)

echo Remember:
echo   * NEVER commit .env files to git
echo   * Update configuration files with your actual values
echo   * Store production secrets in secure vaults
echo   * Review SECURITY_GUIDE.md for best practices

REM ====================
REM Next Steps
REM ====================

echo.
echo ================================================
echo   Setup Complete!
echo ================================================
echo.

echo Next steps:
echo.

if "%ENV%"=="production" (
    echo   1. Edit .env.production with your production values
    echo   2. Review security checklist in SECURITY_GUIDE.md
    echo   3. Run: pnpm ci ^(test everything^)
    echo   4. Deploy: Follow deployment guide in README.md
) else (
    echo   1. Edit .env with your development values
    echo   2. Install dependencies: pnpm install
    echo   3. Start development server: pnpm dev
    echo   4. Open http://localhost:5173
)

echo.
echo Useful commands:
echo.
echo   pnpm dev          - Start development server
echo   pnpm build        - Build for production
echo   pnpm test         - Run tests
echo   pnpm lint         - Check code quality
echo   pnpm ci           - Run all checks

echo.
echo Documentation:
echo.
echo   README.md                - Getting started guide
echo   ONBOARDING.md           - Developer onboarding
echo   SECURITY_GUIDE.md       - Security documentation
echo   EXAMPLE_FILES_GUIDE.md  - Configuration reference

echo.
echo Happy coding! 
echo.

REM ====================
REM Optional: Install dependencies
REM ====================

set /p INSTALL="Do you want to install dependencies now? [y/N]: "
if /i "%INSTALL%"=="y" (
    echo.
    echo Installing dependencies...
    echo.
    call pnpm install
    echo.
    echo [OK] Dependencies installed!
    echo.
    echo Ready to start! Run: pnpm dev
    echo.
)

pause
goto :eof

REM ====================
REM Functions
REM ====================

:CopyFile
set SOURCE=%~1
set DEST=%~2

if exist "%SOURCE%" (
    if exist "%DEST%" (
        echo [SKIP] %DEST% already exists
    ) else (
        copy "%SOURCE%" "%DEST%" >nul
        echo [OK] Created %DEST%
    )
) else (
    echo [ERROR] %SOURCE% not found
)
goto :eof
