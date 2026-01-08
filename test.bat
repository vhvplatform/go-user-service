@echo off
REM Test script for Windows
REM Usage: test.bat [coverage]

if "%1"=="coverage" (
    echo Running tests with coverage...
    go test -v -race -coverprofile=coverage.txt -covermode=atomic ./...
    if %ERRORLEVEL% EQU 0 (
        go tool cover -html=coverage.txt -o coverage.html
        echo Coverage report generated: coverage.html
    ) else (
        echo Tests failed!
        exit /b %ERRORLEVEL%
    )
) else (
    echo Running tests...
    go test -v -race ./...
    if %ERRORLEVEL% NEQ 0 (
        echo Tests failed!
        exit /b %ERRORLEVEL%
    )
)

echo Tests complete!
