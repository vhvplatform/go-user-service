@echo off
REM Install development tools for Windows
REM Usage: install-tools.bat

echo Installing development tools...

echo Installing golangci-lint...
go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest

if exist proto\ (
    echo Installing protobuf tools...
    go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
    go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
)

echo Tools installed!
echo Note: Make sure %%GOPATH%%\bin is in your PATH environment variable
