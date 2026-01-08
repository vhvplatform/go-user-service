@echo off
REM VHV Platform - File Checker Script (Windows)
REM Kiểm tra xem tất cả files cần thiết đã có chưa

echo.
echo ========================================
echo VHV Platform - File Checker
echo ========================================
echo.

set MISSING_FILES=0
set TOTAL_FILES=0

echo [*] Checking root files...
call :check_file "package.json"
call :check_file "vite.config.ts"
call :check_file "tsconfig.json"
call :check_file "postcss.config.mjs"
call :check_file "index.html"
call :check_file ".env"
call :check_file "README.md"

echo.
echo [*] Checking directories...
call :check_dir "src"
call :check_dir "src\app"
call :check_dir "src\app\components"
call :check_dir "src\services"
call :check_dir "src\styles"

echo.
echo [*] Checking source files...
call :check_file "src\main.tsx"
call :check_file "src\app\App.tsx"
call :check_file "src\app\components\Header.tsx"
call :check_file "src\app\components\Sidebar.tsx"
call :check_file "src\app\components\Dashboard.tsx"
call :check_file "src\app\components\UserManagement.tsx"
call :check_file "src\app\components\UserModal.tsx"
call :check_file "src\services\api.ts"
call :check_file "src\services\mockData.ts"
call :check_file "src\styles\index.css"
call :check_file "src\styles\theme.css"

echo.
echo ========================================
echo Summary:
echo    Total checked: %TOTAL_FILES%
echo    Missing: %MISSING_FILES%
echo.

if %MISSING_FILES% equ 0 (
    echo [SUCCESS] All required files are present!
    echo    Ready to run: npm install ^&^& npm run dev
) else (
    echo [WARNING] %MISSING_FILES% file^(s^) missing!
    echo    Please check DOWNLOAD_GUIDE.md for instructions
)

echo.
pause
exit /b

:check_file
set /a TOTAL_FILES+=1
if exist %~1 (
    echo [OK] %~1
) else (
    echo [MISSING] %~1
    set /a MISSING_FILES+=1
)
exit /b

:check_dir
set /a TOTAL_FILES+=1
if exist %~1 (
    echo [OK] %~1\
) else (
    echo [MISSING] %~1\
    set /a MISSING_FILES+=1
)
exit /b
