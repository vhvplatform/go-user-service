# Contributing

Thank you for your interest in contributing!

## Development Setup

### Linux/macOS

See README.md for setup instructions.

### Windows

1. Install prerequisites:
   - Go 1.25.5+ from [golang.org](https://golang.org/dl/)
   - Git for Windows from [git-scm.com](https://git-scm.com/download/win)
   - (Optional) Make via Chocolatey: `choco install make`

2. Clone and setup:
   ```cmd
   git clone https://github.com/vhvplatform/go-user-service.git
   cd go-user-service
   deps.bat
   ```

3. Install development tools:
   ```cmd
   install-tools.bat
   ```

**Note:** Windows developers can use the provided `.bat` scripts as alternatives to `make` commands:
- `build.bat` - Build the service
- `test.bat` - Run tests
- `test.bat coverage` - Run tests with coverage
- `run.bat` - Run the service
- `lint.bat` - Run linters
- `fmt.bat` - Format code
- `clean.bat` - Clean build artifacts
- `deps.bat` - Download dependencies

## Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Ensure all tests pass
6. Submit a pull request

## Code Style

- Follow Go best practices
- Run `make lint` (or `lint.bat` on Windows) before committing
- Add comments for complex logic

## Testing

- Write unit tests for new features
- Ensure coverage remains high
- Run `make test` (or `test.bat` on Windows) before committing

