@echo off
REM Clean script for Windows
REM Usage: clean.bat

echo Cleaning build artifacts...

if exist bin\ (
    rmdir /s /q bin
    echo Removed bin directory
)

if exist dist\ (
    rmdir /s /q dist
    echo Removed dist directory
)

if exist coverage.txt (
    del /q coverage.txt
    echo Removed coverage.txt
)

if exist coverage.html (
    del /q coverage.html
    echo Removed coverage.html
)

for %%f in (*.out) do (
    del /q %%f
    echo Removed %%f
)

go clean -testcache

echo Clean complete!
