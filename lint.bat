@echo off
REM Lint script for Windows
REM Usage: lint.bat

echo Running linters...
golangci-lint run ./...

if %ERRORLEVEL% EQU 0 (
    echo Linting complete!
) else (
    echo Linting failed!
    exit /b %ERRORLEVEL%
)
