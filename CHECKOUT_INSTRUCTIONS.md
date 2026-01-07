# Checkout Instructions for New Repository Structure

This document provides instructions for checking out the repository with the new multi-platform structure.

## New Repository Structure

The repository has been reorganized into a multi-platform architecture:

```
go-user-service/
├── server/          # Golang backend microservice
├── client/          # ReactJS frontend application (coming soon)
├── flutter/         # Flutter mobile application (coming soon)
└── docs/            # Project documentation
```

## Checkout Commands

### Option 1: For New Clones (First Time Setup)

If you are cloning the repository for the first time or don't have it yet:

```bash
git clone https://github.com/vhvplatform/go-user-service.git
cd go-user-service
git checkout copilot/update-repository-structure
```

### Option 2: For Existing Repositories (Switch to New Structure)

If you already have the repository cloned and want to switch to the new structure:

```bash
cd go-user-service
git fetch origin
git checkout copilot/update-repository-structure
git pull origin copilot/update-repository-structure
```

## What Changed?

1. **Golang Backend** → Moved to `server/` directory
   - All Go code, configuration files, and build scripts
   - Go modules (go.mod, go.sum)
   - Dockerfile, Makefile, and batch scripts
   - See [server/README.md](server/README.md) for backend-specific documentation

2. **Client Directory** → Created `client/` directory
   - Placeholder for ReactJS frontend (coming soon)
   - See [client/README.md](client/README.md)

3. **Flutter Directory** → Created `flutter/` directory
   - Placeholder for mobile application (coming soon)
   - See [flutter/README.md](flutter/README.md)

4. **Documentation** → Kept at root in `docs/` directory
   - All markdown documentation files
   - Architecture diagrams and guides

## Working with the New Structure

### Backend Development (Server)

Navigate to the server directory to work with the Golang backend:

```bash
cd server

# Install dependencies
make deps

# Build the service
make build

# Run tests
make test

# Run the service
make run
```

For Windows users, replace `make` commands with the corresponding `.bat` files:
- `make deps` → `deps.bat`
- `make build` → `build.bat`
- `make test` → `test.bat`
- `make run` → `run.bat`

### Frontend Development (Client)

_Coming soon_

### Mobile Development (Flutter)

_Coming soon_

## Verifying Your Setup

After checking out, verify the structure:

```bash
# View the directory structure
tree -L 2 -d

# Or use ls
ls -la
```

You should see:
- `server/` - Contains all Golang backend code
- `client/` - Contains README placeholder
- `flutter/` - Contains README placeholder
- `docs/` - Contains project documentation

## Need Help?

- **Backend Issues**: See [server/README.md](server/README.md)
- **General Documentation**: See [docs/](docs/)
- **Windows Development**: See [WINDOWS_COMPATIBILITY_SUMMARY.md](WINDOWS_COMPATIBILITY_SUMMARY.md)
- **Contributing**: See [CONTRIBUTING.md](CONTRIBUTING.md)
