@echo off
REM ==============================================================================
REM VHV PLATFORM - ENVIRONMENT SETUP VERIFICATION SCRIPT (WINDOWS)
REM ==============================================================================
REM Version: 3.2.0
REM Purpose: Verify environment files are correctly set up
REM Usage: scripts\verify-env-setup.bat
REM ==============================================================================

setlocal enabledelayedexpansion

set PASS=0
set FAIL=0
set WARN=0

echo.
echo ===============================================================
echo    VHV Platform - Environment Verification
echo                 Version 3.2.0
echo ===============================================================
echo.

REM ==============================================================================
REM 1. CHECK EXAMPLE FILES
REM ==============================================================================
echo ===============================================================
echo   1. Checking Environment Example Files
echo ===============================================================
echo.

if exist ".env.example" (
    echo [32m[PASS][0m .env.example exists
    set /a PASS+=1
) else (
    echo [31m[FAIL][0m .env.example NOT FOUND
    set /a FAIL+=1
)

if exist ".env.dev-shared.example" (
    echo [32m[PASS][0m .env.dev-shared.example exists
    set /a PASS+=1
) else (
    echo [31m[FAIL][0m .env.dev-shared.example NOT FOUND
    set /a FAIL+=1
)

if exist ".env.staging.example" (
    echo [32m[PASS][0m .env.staging.example exists
    set /a PASS+=1
) else (
    echo [31m[FAIL][0m .env.staging.example NOT FOUND
    set /a FAIL+=1
)

if exist ".env.production.example" (
    echo [32m[PASS][0m .env.production.example exists
    set /a PASS+=1
) else (
    echo [31m[FAIL][0m .env.production.example NOT FOUND
    set /a FAIL+=1
)

REM ==============================================================================
REM 2. CHECK .GITIGNORE
REM ==============================================================================
echo.
echo ===============================================================
echo   2. Checking .gitignore Configuration
echo ===============================================================
echo.

if exist ".gitignore" (
    echo [32m[PASS][0m .gitignore exists
    set /a PASS+=1
    
    findstr /C:".env" .gitignore >nul
    if !errorlevel! equ 0 (
        echo [32m[PASS][0m .env is in .gitignore
        set /a PASS+=1
    ) else (
        echo [31m[FAIL][0m .env is NOT in .gitignore
        set /a FAIL+=1
    )
) else (
    echo [31m[FAIL][0m .gitignore NOT FOUND
    set /a FAIL+=1
)

REM ==============================================================================
REM 3. CHECK LOCAL .ENV FILE
REM ==============================================================================
echo.
echo ===============================================================
echo   3. Checking Local .env File
echo ===============================================================
echo.

if exist ".env" (
    echo [32m[PASS][0m .env file exists
    set /a PASS+=1
    
    echo.
    echo    Checking required variables...
    
    findstr /B "VITE_APP_ENV=" .env >nul
    if !errorlevel! equ 0 (
        echo [32m[PASS][0m VITE_APP_ENV is set
        set /a PASS+=1
    ) else (
        echo [31m[FAIL][0m VITE_APP_ENV is missing
        set /a FAIL+=1
    )
    
    findstr /B "VITE_API_BASE_URL=" .env >nul
    if !errorlevel! equ 0 (
        echo [32m[PASS][0m VITE_API_BASE_URL is set
        set /a PASS+=1
    ) else (
        echo [31m[FAIL][0m VITE_API_BASE_URL is missing
        set /a FAIL+=1
    )
    
    findstr /B "VITE_SUPABASE_URL=" .env >nul
    if !errorlevel! equ 0 (
        findstr /C:"your-project" .env >nul
        if !errorlevel! equ 0 (
            echo [33m[WARN][0m VITE_SUPABASE_URL needs to be configured
            set /a WARN+=1
        ) else (
            echo [32m[PASS][0m VITE_SUPABASE_URL is configured
            set /a PASS+=1
        )
    ) else (
        echo [31m[FAIL][0m VITE_SUPABASE_URL is missing
        set /a FAIL+=1
    )
    
    findstr /B "VITE_SUPABASE_ANON_KEY=" .env >nul
    if !errorlevel! equ 0 (
        findstr /C:"your-" .env >nul
        if !errorlevel! equ 0 (
            echo [33m[WARN][0m VITE_SUPABASE_ANON_KEY needs to be configured
            set /a WARN+=1
        ) else (
            echo [32m[PASS][0m VITE_SUPABASE_ANON_KEY is configured
            set /a PASS+=1
        )
    ) else (
        echo [31m[FAIL][0m VITE_SUPABASE_ANON_KEY is missing
        set /a FAIL+=1
    )
) else (
    echo [33m[WARN][0m .env file does not exist
    echo          Copy from: copy .env.example .env
    set /a WARN+=1
)

REM ==============================================================================
REM 4. CHECK GIT
REM ==============================================================================
echo.
echo ===============================================================
echo   4. Checking Git
echo ===============================================================
echo.

where git >nul 2>nul
if !errorlevel! equ 0 (
    echo [32m[PASS][0m Git is installed
    set /a PASS+=1
    
    if exist ".git" (
        echo [32m[PASS][0m Git repository initialized
        set /a PASS+=1
    ) else (
        echo [33m[WARN][0m Not a git repository
        set /a WARN+=1
    )
) else (
    echo [33m[WARN][0m Git is not installed
    set /a WARN+=1
)

REM ==============================================================================
REM 5. CHECK PNPM
REM ==============================================================================
echo.
echo ===============================================================
echo   5. Checking PNPM Installation
echo ===============================================================
echo.

where pnpm >nul 2>nul
if !errorlevel! equ 0 (
    for /f "tokens=*" %%i in ('pnpm --version') do set PNPM_VERSION=%%i
    echo [32m[PASS][0m PNPM is installed (v!PNPM_VERSION!)
    set /a PASS+=1
    
    if exist "pnpm-lock.yaml" (
        echo [32m[PASS][0m pnpm-lock.yaml exists
        set /a PASS+=1
    ) else (
        echo [33m[WARN][0m pnpm-lock.yaml not found (run: pnpm install)
        set /a WARN+=1
    )
    
    if exist "node_modules" (
        echo [32m[PASS][0m node_modules directory exists
        set /a PASS+=1
    ) else (
        echo [33m[WARN][0m node_modules not found (run: pnpm install)
        set /a WARN+=1
    )
) else (
    echo [33m[WARN][0m PNPM is not installed
    echo          Install: npm install -g pnpm
    set /a WARN+=1
)

REM ==============================================================================
REM 6. CHECK PACKAGE.JSON
REM ==============================================================================
echo.
echo ===============================================================
echo   6. Checking package.json
echo ===============================================================
echo.

if exist "package.json" (
    echo [32m[PASS][0m package.json exists
    set /a PASS+=1
    
    findstr /C:"\"dev\":" package.json >nul
    if !errorlevel! equ 0 (
        echo [32m[PASS][0m dev script is defined
        set /a PASS+=1
    ) else (
        echo [33m[WARN][0m dev script not found
        set /a WARN+=1
    )
    
    findstr /C:"\"build\":" package.json >nul
    if !errorlevel! equ 0 (
        echo [32m[PASS][0m build script is defined
        set /a PASS+=1
    ) else (
        echo [33m[WARN][0m build script not found
        set /a WARN+=1
    )
) else (
    echo [31m[FAIL][0m package.json NOT FOUND
    set /a FAIL+=1
)

REM ==============================================================================
REM 7. CHECK VITE CONFIG
REM ==============================================================================
echo.
echo ===============================================================
echo   7. Checking Vite Configuration
echo ===============================================================
echo.

if exist "vite.config.ts" (
    echo [32m[PASS][0m vite.config.ts exists
    set /a PASS+=1
) else if exist "vite.config.js" (
    echo [32m[PASS][0m vite.config.js exists
    set /a PASS+=1
) else (
    echo [31m[FAIL][0m Vite config NOT FOUND
    set /a FAIL+=1
)

REM ==============================================================================
REM 8. CHECK DOCUMENTATION
REM ==============================================================================
echo.
echo ===============================================================
echo   8. Checking Documentation
echo ===============================================================
echo.

if exist "ENV_COMPLETE_GUIDE.md" (
    echo [32m[PASS][0m ENV_COMPLETE_GUIDE.md exists
    set /a PASS+=1
) else (
    echo [33m[WARN][0m ENV_COMPLETE_GUIDE.md not found
    set /a WARN+=1
)

if exist "ENV_FILES_LOCATION.md" (
    echo [32m[PASS][0m ENV_FILES_LOCATION.md exists
    set /a PASS+=1
) else (
    echo [33m[WARN][0m ENV_FILES_LOCATION.md not found
    set /a WARN+=1
)

if exist "PNPM_GUIDE.md" (
    echo [32m[PASS][0m PNPM_GUIDE.md exists
    set /a PASS+=1
) else (
    echo [33m[WARN][0m PNPM_GUIDE.md not found
    set /a WARN+=1
)

if exist "SECURITY_GUIDE.md" (
    echo [32m[PASS][0m SECURITY_GUIDE.md exists
    set /a PASS+=1
) else (
    echo [33m[WARN][0m SECURITY_GUIDE.md not found
    set /a WARN+=1
)

REM ==============================================================================
REM 9. SUMMARY
REM ==============================================================================
echo.
echo ===============================================================
echo   Summary
echo ===============================================================
echo.

set /a TOTAL=PASS+FAIL+WARN

echo [32mPASSED:   %PASS%[0m
echo [33mWARNINGS: %WARN%[0m
echo [31mFAILED:   %FAIL%[0m
echo TOTAL:    %TOTAL%
echo.

if %FAIL% equ 0 (
    if %WARN% equ 0 (
        echo ===============================================================
        echo    [32m[PASS][0m ALL CHECKS PASSED!
        echo    Environment is properly configured
        echo ===============================================================
        exit /b 0
    ) else (
        echo ===============================================================
        echo    [33m[WARN][0m CHECKS PASSED WITH WARNINGS
        echo    Please review warnings above
        echo ===============================================================
        exit /b 0
    )
) else (
    echo ===============================================================
    echo    [31m[FAIL][0m SOME CHECKS FAILED
    echo    Please fix errors above
    echo ===============================================================
    exit /b 1
)
