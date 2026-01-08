@echo off
REM Format code script for Windows
REM Usage: fmt.bat

echo Formatting code...
go fmt ./...
gofmt -s -w .

echo Formatting complete!
