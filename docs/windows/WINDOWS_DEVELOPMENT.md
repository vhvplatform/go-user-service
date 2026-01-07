# Windows Development Guide

This guide provides detailed instructions for setting up and developing the go-user-service on Windows.

## Prerequisites

### Required Software

1. **Go 1.25.5+**
   - Download from: https://golang.org/dl/
   - During installation, ensure "Add to PATH" is checked
   - Verify installation: `go version`

2. **Git for Windows**
   - Download from: https://git-scm.com/download/win
   - Use default settings during installation
   - Verify installation: `git --version`

3. **MongoDB 4.4+** (if running locally)
   - Download from: https://www.mongodb.com/try/download/community
   - Or use Docker Desktop with MongoDB container

4. **Redis 6.0+** (if running locally)
   - Download from: https://github.com/microsoftarchive/redis/releases
   - Or use Docker Desktop with Redis container

### Optional Software

1. **Make for Windows**
   - Install via Chocolatey: `choco install make`
   - Or use Windows Subsystem for Linux (WSL)
   - Note: Batch scripts are provided as an alternative

2. **Docker Desktop**
   - Download from: https://www.docker.com/products/docker-desktop
   - Required for containerized development

3. **Visual Studio Code**
   - Download from: https://code.visualstudio.com/
   - Recommended extensions:
     - Go (golang.go)
     - GitLens
     - Docker

## Setup Instructions

### 1. Clone the Repository

```cmd
git clone https://github.com/vhvplatform/go-user-service.git
cd go-user-service
```

### 2. Install Dependencies

```cmd
deps.bat
```

Or manually:
```cmd
go mod download
go mod tidy
```

### 3. Install Development Tools

```cmd
install-tools.bat
```

This will install:
- golangci-lint (linter)
- protoc-gen-go (if proto files exist)
- protoc-gen-go-grpc (if proto files exist)

**Important:** Ensure `%GOPATH%\bin` is in your PATH environment variable.

To add to PATH:
1. Open "Environment Variables" in Windows Settings
2. Edit the "Path" variable under "User variables"
3. Add `%USERPROFILE%\go\bin`
4. Restart your terminal/IDE

### 4. Configure Environment Variables

Copy the example environment file:
```cmd
copy .env.example .env
```

Edit `.env` with your local configuration:
```env
USER_SERVICE_PORT=50052
USER_SERVICE_HTTP_PORT=8082
ENVIRONMENT=development
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=saas_framework
REDIS_URL=redis://localhost:6379/0
LOG_LEVEL=debug
```

## Development Workflow

### Building

```cmd
REM Build the service
build.bat

REM The binary will be created at: bin\user-service.exe
```

### Running

```cmd
REM Run the service
run.bat

REM Or run directly with go
go run cmd\main.go
```

### Testing

```cmd
REM Run all tests
test.bat

REM Run tests with coverage
test.bat coverage

REM View coverage report
REM Open coverage.html in your browser
```

### Linting and Formatting

```cmd
REM Run linters
lint.bat

REM Format code
fmt.bat

REM Run go vet
go vet .\...
```

### Cleaning

```cmd
REM Clean build artifacts
clean.bat
```

## Available Batch Scripts

The following batch scripts are available as alternatives to Makefile commands:

| Script | Description | Make Equivalent |
|--------|-------------|-----------------|
| `build.bat` | Build the service | `make build` |
| `test.bat` | Run tests | `make test` |
| `test.bat coverage` | Run tests with coverage | `make test-coverage` |
| `run.bat` | Run the service | `make run` |
| `lint.bat` | Run linters | `make lint` |
| `fmt.bat` | Format code | `make fmt` |
| `clean.bat` | Clean artifacts | `make clean` |
| `deps.bat` | Download dependencies | `make deps` |
| `install-tools.bat` | Install dev tools | `make install-tools` |

## Using Docker on Windows

### Prerequisites

1. Install Docker Desktop for Windows
2. Ensure Docker is running (check system tray)

### Build and Run

```cmd
docker build -t go-user-service:latest .
docker run -p 8082:8082 -p 50052:50052 go-user-service:latest
```

Or using Make (if installed):
```cmd
make docker-build
make docker-run
```

### Using Docker Compose (if available)

```cmd
docker-compose up -d
```

## Common Windows-Specific Issues

### Issue 1: Path Separators

**Problem:** Scripts fail with path-related errors.

**Solution:** Windows uses backslashes (`\`) instead of forward slashes (`/`). The provided `.bat` scripts handle this automatically. When writing custom scripts, use:
- `.\cmd\main.go` instead of `./cmd/main.go`
- `bin\user-service.exe` instead of `bin/user-service`

### Issue 2: GOPATH Not in PATH

**Problem:** Installed tools like `golangci-lint` are not found.

**Solution:** Add `%USERPROFILE%\go\bin` to your PATH:
1. Search for "Environment Variables" in Windows
2. Edit "Path" under User variables
3. Add new entry: `%USERPROFILE%\go\bin`
4. Restart terminal

### Issue 3: Line Endings (CRLF vs LF)

**Problem:** Git warnings about line endings.

**Solution:** Configure Git to handle line endings:
```cmd
git config --global core.autocrlf true
```

### Issue 4: Long File Paths

**Problem:** Errors related to file path length limits.

**Solution:** Enable long paths in Windows:
1. Run as Administrator:
   ```cmd
   reg add HKLM\SYSTEM\CurrentControlSet\Control\FileSystem /v LongPathsEnabled /t REG_DWORD /d 1
   ```
2. Or enable in Group Policy Editor

### Issue 5: Permission Errors

**Problem:** Cannot execute certain commands.

**Solution:** Run your terminal/IDE as Administrator, or adjust file permissions.

### Issue 6: MongoDB Connection Issues

**Problem:** Cannot connect to MongoDB.

**Solution:**
1. Ensure MongoDB service is running:
   ```cmd
   net start MongoDB
   ```
2. Or use Docker:
   ```cmd
   docker run -d -p 27017:27017 mongo:7.0
   ```

## Development with WSL (Windows Subsystem for Linux)

As an alternative to native Windows development, you can use WSL:

1. Install WSL2:
   ```cmd
   wsl --install
   ```

2. Install Ubuntu from Microsoft Store

3. Inside WSL, follow Linux development instructions:
   ```bash
   # Install Go in WSL
   wget https://golang.org/dl/go1.25.5.linux-amd64.tar.gz
   sudo tar -C /usr/local -xzf go1.25.5.linux-amd64.tar.gz
   export PATH=$PATH:/usr/local/go/bin
   
   # Clone and develop as on Linux
   git clone https://github.com/vhvplatform/go-user-service.git
   cd go-user-service
   make build
   ```

## IDE Setup

### Visual Studio Code

1. Install the Go extension (golang.go)

2. Configure settings (`.vscode/settings.json`):
   ```json
   {
     "go.useLanguageServer": true,
     "go.lintTool": "golangci-lint",
     "go.lintOnSave": "package",
     "go.formatTool": "gofmt",
     "go.formatOnSave": true,
     "[go]": {
       "editor.codeActionsOnSave": {
         "source.organizeImports": true
       }
     }
   }
   ```

3. Install Go tools when prompted by VS Code

### GoLand

1. Open the project in GoLand
2. GoLand will automatically detect the Go SDK
3. Configure GOROOT and GOPATH in Settings > Go > GOROOT
4. Enable "Go Modules" support in Settings > Go > Go Modules

## Troubleshooting

### Verify Installation

Run these commands to verify your setup:

```cmd
REM Check Go version
go version

REM Check Git version
git version

REM Check if development tools are installed
golangci-lint --version

REM Test build
build.bat

REM Test run (Ctrl+C to stop)
run.bat
```

### Getting Help

- Check [GitHub Issues](https://github.com/vhvplatform/go-user-service/issues)
- Review [README.md](../README.md)
- Check [CONTRIBUTING.md](../CONTRIBUTING.md)

## Performance Tips

1. **Enable Go modules cache:** Go automatically caches modules in `%GOPATH%\pkg\mod`
2. **Use SSD:** Store your workspace on an SSD for faster build times
3. **Exclude from antivirus:** Add your Go workspace to antivirus exclusions
4. **Use Docker:** Consider Docker for dependencies to simplify setup

## Next Steps

- Review [API.md](API.md) for API documentation
- Check [ARCHITECTURE.md](ARCHITECTURE.md) for architecture details
- Read [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines
