@echo off
REM Build script for Windows
REM Usage: build.bat

echo Building user-service...
go build -o bin\user-service.exe .\cmd\main.go

if %ERRORLEVEL% EQU 0 (
    echo Build complete!
    echo Binary available at: bin\user-service.exe
) else (
    echo Build failed!
    exit /b %ERRORLEVEL%
)
