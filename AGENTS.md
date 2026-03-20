# Wellcome Collection Development Guidelines

**These guidelines are for active development and coding tasks.** For PR review guidelines, see [.github/copilot-instructions.md](.github/copilot-instructions.md).

Guidelines for AI assistants working on the Wellcome Collection codebase.

## Working Style

**Ask questions before implementing.** If requirements are unclear, the approach is ambiguous, or there are multiple reasonable solutions, ask rather than guessing. This saves rework and ensures we build the right thing.

**Complete your work properly.** Before considering a task done:
- Fix all linting errors
- If necessary, run `yarn tsc` from the root to check TypeScript errors
- Test your changes locally where possible
- Check that imports and dependencies are correct

Use British English spelling throughout. Write casually and keep explanations clear. Don't use emojis or bold text in responses.

## Workspace Structure

This is a monorepo with multiple Next.js apps managed by Yarn workspaces:
- `common/` - shared code used by all apps (components, utilities, services, types)
- `content/webapp/` - main public-facing website (stories, exhibitions, events, catalogue)
- `identity/webapp/` - account management app (login, registration, library membership)
- `toggles/webapp/` - feature flags management
- `dash/webapp/` - internal dashboard

All shared code lives in `common/` and is imported using `@weco/` package names, not relative paths across package boundaries.

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

Example: [common/utils/undici-agent.ts](./common/utils/undici-agent.ts) shows how to safely handle server-only dependencies.

**Why this matters:** Server-only packages that try to load in the browser will cause "Cannot find module" errors even with webpack exclusion. You need both webpack config AND runtime checks.

## Backend Concepts

The team is strong on front-end but may benefit from extra explanation of backend/infrastructure concepts:

- **HTTP connection pooling and keep-alive behaviour**: Reusing connections reduces latency. Timeouts must be coordinated between client and server (client timeout < server timeout) to avoid connection resets.
- **Docker and deployment**: How code gets built and deployed to production.

When implementing backend code, explain the reasoning behind technical decisions, not just what the code does.

## Accessibility

We aim for WCAG AA compliance as a minimum. Implement accessible patterns:

- Use semantic HTML (proper heading hierarchy, landmarks, form labels)
- Ensure keyboard navigation works for all interactive elements
- Provide alt text for meaningful images (empty alt="" for decorative ones)
- Check colour contrast ratios meet AA standards
- Use ARIA attributes correctly (don't over-use them - semantic HTML is usually better)
- Manage focus properly in interactive components (modals, dropdowns, etc.)

## Naming Conventions

Follow these patterns consistently:
- Component files: PascalCase (`Header.tsx`, `PageLayout.tsx`)
- Utility files: kebab-case (`undici-agent.ts`, `json-ld.ts`)
- Test files: same name as source with `.test.ts` / `.test.tsx` suffix (match the source extension, e.g. `Component.tsx` → `Component.test.tsx`)
- Type declarations: `.d.ts` extension for ambient declarations
- Service/utility folders: use `index.ts` as the main export point

## Avoid Duplication

Before creating new utilities, helpers, or services:
1. Search `common/utils/` and `common/services/` for existing implementations
2. Check if similar logic exists elsewhere in the codebase
3. If you find duplication, refactor to use a shared utility instead of creating a new one
4. When removing dependencies, clean up unused imports and delete obsolete files

Key locations for shared code:
- `common/utils/` - shared utilities
- `common/services/` - shared services (API clients, etc.)
- `content/webapp/services/prismic/transformers/` - Prismic content transformers
- `content/webapp/services/` - API clients for catalogue, content, concepts

Use `@weco/common` imports, not relative paths across package boundaries.

## Pull Requests

See [CONTRIBUTING.md](./CONTRIBUTING.md) for general contribution guidelines and repository conventions.

Our PR template (configured in GitHub's interface) asks for:
- **What does this change?** - Detail the problem, why the change is needed, and how it solves it
- **How to test** - Instructions to verify the change (e.g., "On PROD, do X and see Y. On this branch, do X and see Z.")
- **How can we measure success?** - Expected impact (reduced errors, simplified journeys, etc.) and how to prove it
- **Have we considered potential risks?** - Potential risks, mitigations, and whether alarms are needed

When writing PR descriptions, follow this structure and provide enough detail for the PR to be understandable in the future.
