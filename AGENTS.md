# Wellcome Collection Development Guidelines

**These guidelines are for active development and coding tasks.** Shared coding standards and PR review guidelines are in [.github/copilot-instructions.md](.github/copilot-instructions.md).

Guidelines for AI assistants working on the Wellcome Collection codebase. Shared coding standards (naming, accessibility, duplication, workspace structure, Prismic conventions) are in [.github/copilot-instructions.md](.github/copilot-instructions.md) — don't duplicate them here. The sections below cover agent-specific operational guidance.

## Working Style

**Ask questions before implementing.** If requirements are unclear, the approach is ambiguous, or there are multiple reasonable solutions, ask rather than guessing. This saves rework and ensures we build the right thing.

Consider our version of Node by consulting `.nvmrc`.

**Complete your work properly.** Before considering a task done:
- Fix all linting errors
- If necessary, run `yarn tsc` from the root to check TypeScript errors
- Test your changes locally where possible
- Check that imports and dependencies are correct

Write casually and keep explanations clear. Don't use emojis or bold text in responses.

## Build and Test

### Running apps locally
```bash
yarn install
yarn content    # runs content webapp
yarn identity   # runs identity webapp
```

Both apps can run together: `(yarn content & yarn identity)`

### Type checking
```bash
yarn tsc        # from root - checks TypeScript across all packages
```

### Testing
```bash
yarn test       # runs Jest tests
```

### Documentation

Key documentation files:
- [playwright/README.md](./playwright/README.md) - E2E testing with Playwright, user stories approach
- [docs/testing-the-site-on-dates-that-arent-right-now.md](./docs/testing-the-site-on-dates-that-arent-right-now.md) - How to test date logic
- [common/README.md](./common/README.md) - About shared code structure, data directory, Prismic conventions
- [docs/git-hooks.md](./docs/git-hooks.md) - Git hooks with Husky (pre-commit linting)
- [docs/](./docs/) - Additional feature-specific documentation

## Server vs Client Code

Next.js code runs in both Node.js (server-side rendering) and the browser (client-side). When using Node.js-only APIs or packages:

- Use `typeof window === 'undefined'` to detect server-side context
- Use dynamic imports `await import()` for Node.js-only packages
- Add webpack config to exclude server-only packages from client bundles

Example: When adding utilities that rely on server-only dependencies (for example HTTP clients or Node.js core modules), ensure they are only imported and executed in server contexts using runtime checks and appropriate webpack configuration.

**Why this matters:** Server-only packages that try to load in the browser will cause "Cannot find module" errors even with webpack exclusion. You need both webpack config AND runtime checks.

## Backend Concepts

The team is strong on front-end but may benefit from extra explanation of backend/infrastructure concepts:

- **HTTP connection pooling and keep-alive behaviour**: Reusing connections reduces latency. Timeouts must be coordinated between client and server (client timeout < server timeout) to avoid connection resets.
- **Docker and deployment**: How code gets built and deployed to production.

When implementing backend code, explain the reasoning behind technical decisions, not just what the code does.

## Pull Requests

See [CONTRIBUTING.md](./CONTRIBUTING.md) for general contribution guidelines and repository conventions.

Our PR template (configured in GitHub's interface) asks for:
- **What does this change?** - Detail the problem, why the change is needed, and how it solves it
- **How to test** - Instructions to verify the change (e.g., "On PROD, do X and see Y. On this branch, do X and see Z.")
- **How can we measure success?** - Expected impact (reduced errors, simplified journeys, etc.) and how to prove it
- **Have we considered potential risks?** - Potential risks, mitigations, and whether alarms are needed

When writing PR descriptions, follow this structure and provide enough detail for the PR to be understandable in the future.
