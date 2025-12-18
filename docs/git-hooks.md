# Git Hooks Setup

This repository uses [Husky](https://typicode.github.io/husky/) to manage Git hooks that run automatically during Git operations.

## What is Husky?

Husky is a tool that makes it easy to use Git hooks in your project. Git hooks are scripts that run automatically when certain Git events occur (like committing or pushing code).

## Current Hooks

### Pre-commit Hook

The pre-commit hook runs **before** a commit is created. It ensures code quality by running:

- **lint-staged**: Lints and formats only the files you're about to commit
  - ESLint checks for JavaScript/TypeScript issues
  - Stylelint checks for styled-components issues

This means that any staged files will be automatically linted and fixed before being committed.

## Setup for New Developers

When you clone this repository and run `yarn install` for the first time, Husky will automatically:

1. Install the Git hooks in your local `.git/hooks/` directory
2. Configure Git to use the hooks defined in the `.husky/` directory

**You don't need to do anything special** - just run:

```bash
yarn install
```

The `prepare` script in `package.json` will handle the rest.

## Troubleshooting

### Hooks Not Running?

If your pre-commit hooks aren't running, try the following:

1. **Verify Husky is installed:**
   ```bash
   yarn list husky
   ```

2. **Check Git hooks path:**
   ```bash
   git config core.hooksPath
   ```
   This should output `.husky` or `.husky/`

3. **Reinstall hooks:**
   ```bash
   yarn prepare
   ```

4. **Verify the hook is executable:**
   ```bash
   ls -la .husky/pre-commit
   ```
   The file should have executable permissions (should show `-rwxr-xr-x` or similar)

### Bypassing Hooks (Not Recommended)

In rare cases, you might need to commit without running the hooks (e.g., if you're committing a work-in-progress for backup purposes). You can do this with:

```bash
git commit --no-verify -m "Your commit message"
```

**Warning:** Use this sparingly. The hooks are there to maintain code quality.

## Upgrading Husky

This repository uses Husky v9. If you're upgrading Husky in the future:

1. Update the dependency: `yarn add husky@latest -D -W`
2. The `.husky/` directory structure should remain compatible
3. Test the hooks work: make a change, stage it, and try to commit

## More Information

- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged Documentation](https://github.com/lint-staged/lint-staged)
