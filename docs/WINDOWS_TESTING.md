# Windows Batch Script Testing Guide

This document describes how to test the Windows batch scripts on an actual Windows system.

## Prerequisites

- Windows 10/11 system
- Go 1.25.5+ installed
- Git for Windows installed

## Testing Checklist

### 1. Test `deps.bat`

```cmd
cd go-user-service
deps.bat
```

**Expected Result:**
- Dependencies downloaded successfully
- No error messages
- `go.mod` and `go.sum` remain unchanged

### 2. Test `build.bat`

```cmd
build.bat
```

**Expected Result:**
- Message: "Building user-service..."
- Message: "Build complete!"
- File created: `bin\user-service.exe`
- No error messages

### 3. Test `test.bat`

```cmd
test.bat
```

**Expected Result:**
- Message: "Running tests..."
- All tests pass
- Message: "Tests complete!"

### 4. Test `test.bat coverage`

```cmd
test.bat coverage
```

**Expected Result:**
- Message: "Running tests with coverage..."
- Coverage report generated
- Files created: `coverage.txt` and `coverage.html`
- Message: "Coverage report generated: coverage.html"

### 5. Test `lint.bat`

```cmd
REM First install golangci-lint
install-tools.bat

REM Then run lint
lint.bat
```

**Expected Result:**
- Linter runs successfully
- Message: "Linting complete!" (if no issues)
- Or: List of linting issues to fix

### 6. Test `fmt.bat`

```cmd
fmt.bat
```

**Expected Result:**
- Code is formatted
- Message: "Formatting complete!"

### 7. Test `run.bat`

```cmd
REM Ensure you have a .env file first
copy .env.example .env

REM Run the service
run.bat
```

**Expected Result:**
- Service starts without errors
- Service listens on configured ports
- Press Ctrl+C to stop

### 8. Test `clean.bat`

```cmd
clean.bat
```

**Expected Result:**
- Message: "Cleaning build artifacts..."
- Directories removed: `bin\`, `dist\`
- Files removed: `coverage.txt`, `coverage.html`
- Message: "Clean complete!"

### 9. Test `install-tools.bat`

```cmd
install-tools.bat
```

**Expected Result:**
- golangci-lint installed
- protoc tools installed (if proto directory exists)
- Message: "Tools installed!"
- Note about adding `%GOPATH%\bin` to PATH

## Manual Verification

After running the tests above, verify the following:

1. **Check binary execution:**
   ```cmd
   bin\user-service.exe --help
   ```
   Should show help information or start the service.

2. **Check file permissions:**
   - All `.bat` files should be executable
   - No permission errors during execution

3. **Check path handling:**
   - Scripts correctly use backslashes (`\`)
   - No path-related errors

4. **Check error handling:**
   - Scripts exit with proper error codes
   - Error messages are clear and helpful

## Common Issues and Solutions

### Issue: "command not found"

**Cause:** Go or Git not in PATH

**Solution:**
1. Verify Go installation: `go version`
2. Verify Git installation: `git --version`
3. Add to PATH if needed

### Issue: "golangci-lint not found"

**Cause:** Development tools not installed or not in PATH

**Solution:**
```cmd
install-tools.bat
```
Then add `%USERPROFILE%\go\bin` to PATH.

### Issue: "cannot find package"

**Cause:** Dependencies not downloaded

**Solution:**
```cmd
deps.bat
```

### Issue: Build fails

**Cause:** Missing dependencies or Go version mismatch

**Solution:**
1. Check Go version: `go version` (should be 1.25.5+)
2. Clean and rebuild:
   ```cmd
   clean.bat
   deps.bat
   build.bat
   ```

## Test Results Template

When testing on Windows, please document your results:

```
Date: YYYY-MM-DD
Windows Version: [e.g., Windows 11 22H2]
Go Version: [e.g., go1.25.5 windows/amd64]

Test Results:
- [ ] deps.bat - PASS/FAIL - Notes: ___
- [ ] build.bat - PASS/FAIL - Notes: ___
- [ ] test.bat - PASS/FAIL - Notes: ___
- [ ] test.bat coverage - PASS/FAIL - Notes: ___
- [ ] lint.bat - PASS/FAIL - Notes: ___
- [ ] fmt.bat - PASS/FAIL - Notes: ___
- [ ] run.bat - PASS/FAIL - Notes: ___
- [ ] clean.bat - PASS/FAIL - Notes: ___
- [ ] install-tools.bat - PASS/FAIL - Notes: ___

Overall Result: PASS/FAIL

Additional Notes:
[Any other observations or issues encountered]
```

## Automated Testing (Future Enhancement)

Consider adding Windows to the CI/CD pipeline:

```yaml
# .github/workflows/windows-test.yml
name: Windows Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test-windows:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Go
        uses: actions/setup-go@v6
        with:
          go-version: '1.25.5'
      
      - name: Download dependencies
        run: deps.bat
        shell: cmd
      
      - name: Build
        run: build.bat
        shell: cmd
      
      - name: Run tests
        run: test.bat
        shell: cmd
```

## Contact

If you encounter any issues during testing, please:
1. Document the issue using the template above
2. Open a GitHub issue with the "windows" label
3. Include your test results and environment details
