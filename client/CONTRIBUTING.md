# ==================================
# CONTRIBUTING TO VHV PLATFORM
# ==================================

Thank you for considering contributing to VHV Platform! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)

## 🤝 Code of Conduct

### Our Standards

- **Be respectful** and inclusive
- **Be collaborative** and supportive
- **Be constructive** in feedback
- **Be professional** in all interactions

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/frontend.git
cd frontend

# Add upstream remote
git remote add upstream https://github.com/vhvplatform/frontend.git
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Create Branch

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
```

## 💻 Development Workflow

### 1. Make Changes

```bash
# Edit files
# Save your work
```

### 2. Test Your Changes

```bash
# Run type check
pnpm type-check

# Run linter
pnpm lint

# Format code
pnpm format

# Run tests
pnpm test

# Run full CI locally
pnpm ci
```

### 3. Commit Changes

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format: <type>(<scope>): <description>

# Types:
# - feat: New feature
# - fix: Bug fix
# - docs: Documentation changes
# - style: Code style changes (formatting)
# - refactor: Code refactoring
# - test: Test additions or changes
# - chore: Build process or tooling changes
# - perf: Performance improvements

# Examples:
git commit -m "feat(auth): add 2FA support"
git commit -m "fix(users): resolve pagination issue"
git commit -m "docs: update API integration guide"
git commit -m "test(security): add encryption tests"
```

### 4. Push Changes

```bash
git push origin feature/your-feature-name
```

### 5. Create Pull Request

1. Go to GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill in the PR template
5. Link related issues
6. Request reviews

## 📝 Coding Standards

### TypeScript

```typescript
// ✅ DO: Use TypeScript for all files
interface User {
  id: string;
  name: string;
  email: string;
}

export function getUser(id: string): Promise<User> {
  // Implementation
}

// ❌ DON'T: Use 'any' type
function badFunction(data: any) { // Avoid this
  // ...
}
```

### React Components

```typescript
// ✅ DO: Functional components with TypeScript
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export function Button({ onClick, children, variant = 'primary' }: ButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
}

// ❌ DON'T: Class components (unless necessary)
```

### File Naming

```bash
# Components: PascalCase
UserProfile.tsx
AuthForm.tsx

# Services: camelCase
user-service.ts
auth-service.ts

# Tests: match source file + .test
user-service.test.ts
UserProfile.test.tsx

# Types: PascalCase
User.types.ts
Api.types.ts
```

### Import Order

```typescript
// 1. External packages
import { useState } from 'react';
import axios from 'axios';

// 2. Internal modules
import { Button } from '@/components/ui/button';
import { userService } from '@/services/user-service';

// 3. Types
import type { User } from '@/types/User';

// 4. Styles
import './styles.css';
```

## 🧪 Testing Guidelines

### Test Structure

```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('UserService', () => {
  beforeEach(() => {
    // Setup
  });

  describe('getUsers', () => {
    it('should fetch users successfully', async () => {
      // Arrange
      const expected = [{ id: '1', name: 'John' }];

      // Act
      const result = await userService.getUsers();

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toEqual(expected);
    });

    it('should handle errors gracefully', async () => {
      // Test error cases
    });
  });
});
```

### Test Coverage

- Aim for **80%+ coverage**
- Test happy paths AND error cases
- Test edge cases
- Test security features

### What to Test

✅ **DO test:**
- Business logic
- API interactions
- Error handling
- User interactions
- Security features

❌ **DON'T test:**
- Third-party libraries
- Simple getters/setters
- Pure UI styling

## 🔍 Code Review Checklist

### Before Submitting PR

- [ ] Code follows style guide
- [ ] All tests pass
- [ ] Added tests for new features
- [ ] Updated documentation
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] No hardcoded values
- [ ] Security best practices followed
- [ ] Performance considered
- [ ] Accessibility checked

### For Reviewers

- [ ] Code is clear and maintainable
- [ ] Tests are comprehensive
- [ ] Security is not compromised
- [ ] Performance is acceptable
- [ ] Documentation is updated
- [ ] No breaking changes (or documented)

## 📬 Pull Request Process

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Fixes #123

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guide
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No breaking changes
```

### PR Review Process

1. **Submit PR** with complete description
2. **CI checks** must pass (automatic)
3. **Code review** by 1-2 team members
4. **Address feedback** and update PR
5. **Approval** from reviewers
6. **Merge** by maintainer

### Merge Requirements

- ✅ All CI checks pass
- ✅ 1+ approvals from maintainers
- ✅ No merge conflicts
- ✅ Tests pass with coverage
- ✅ Documentation updated

## 🐛 Issue Guidelines

### Creating Issues

#### Bug Report Template

```markdown
**Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: [e.g., macOS 13.0]
- Browser: [e.g., Chrome 120]
- Version: [e.g., 3.2.0]

**Screenshots**
If applicable
```

#### Feature Request Template

```markdown
**Feature Description**
Clear description of the feature

**Use Case**
Why this feature is needed

**Proposed Solution**
How you think it should work

**Alternatives Considered**
Other approaches you've thought about
```

## 🏷️ Labels

- `bug` - Something isn't working
- `feature` - New feature request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `security` - Security-related
- `performance` - Performance improvements
- `breaking change` - Breaks existing functionality

## 🎯 Development Priorities

### High Priority
- Security fixes
- Critical bugs
- Performance issues

### Medium Priority
- New features
- Enhancements
- Documentation

### Low Priority
- Code cleanup
- Minor improvements
- Nice-to-have features

## 📚 Resources

### Documentation
- [README.md](./README.md)
- [ONBOARDING.md](./ONBOARDING.md)
- [SECURITY_GUIDE.md](./SECURITY_GUIDE.md)
- [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)

### Learning
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com)

## 💬 Communication

- **GitHub Issues** - Bug reports and features
- **GitHub Discussions** - Questions and ideas
- **Slack** - #frontend-dev channel
- **Email** - dev-team@vhvplatform.com

## 🎉 Recognition

Contributors will be:
- Listed in README.md
- Mentioned in release notes
- Thanked in team meetings

Thank you for contributing! 🙏

---

**Questions?** Open a discussion or ask in Slack!
