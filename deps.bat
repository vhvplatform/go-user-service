@echo off
REM Download dependencies script for Windows
REM Usage: deps.bat

echo Downloading dependencies...
go mod download
go mod tidy

if %ERRORLEVEL% EQU 0 (
    echo Dependencies downloaded successfully!
) else (
    echo Failed to download dependencies!
    exit /b %ERRORLEVEL%
)
