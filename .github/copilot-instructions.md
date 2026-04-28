# Wellcome Collection Coding Standards

These guidelines are read by all Copilot surfaces (IDE agent, PR reviewer, cloud agent). For agent-specific operational guidelines (build commands, working style), see [AGENTS.md](../AGENTS.md).

Use British English spelling throughout everything that is not code (e.g. CSS values are in American English).

## Workspace Structure

This is a monorepo with multiple Next.js apps managed by Yarn workspaces:
- `common/` - shared code used by all apps (components, utilities, services, types)
- `content/webapp/` - main public-facing website (stories, exhibitions, events, catalogue)
- `identity/webapp/` - account management app (login, registration, library membership)
- `toggles/webapp/` - feature flags management
- `dash/webapp/` - internal dashboard

All shared code lives in `common/` and is imported using `@weco/` package names, not relative paths across package boundaries.

## Naming Conventions

Follow these patterns consistently:
- Component files: PascalCase (`Header.tsx`, `PageLayout.tsx`)
- Utility files: kebab-case (`undici-agent.ts`, `json-ld.ts`)
- Test files: same name as source with `.test.ts` / `.test.tsx` suffix (match the source extension, e.g. `Component.tsx` → `Component.test.tsx`)
- Type declarations: `.d.ts` extension for ambient declarations
- Service/utility folders: use `index.ts` as the main export point

## Accessibility

We aim for WCAG AA compliance as a minimum:

- Semantic HTML (proper heading hierarchy, landmarks, form labels)
- Keyboard navigation for all interactive elements
- Alt text for meaningful images (empty `alt=""` for decorative ones)
- Colour contrast ratios meet AA standards
- ARIA attributes used correctly (don't over-use them — semantic HTML is usually better)
- Focus management in interactive components (modals, dropdowns, etc.)
- Screen reader navigation and announcements

## Duplication and Code Reuse

Before creating new utilities, helpers, or services:
1. Search `common/utils/` and `common/services/` for existing implementations
2. Check if similar logic exists elsewhere in the codebase
3. If you find duplication, refactor to use a shared utility instead of creating a new one
4. When removing dependencies, clean up unused imports and delete obsolete files

Key locations for shared code:
- `common/utils/` - shared utilities
- `common/services/` - shared services (API clients, etc.)
- `content/webapp/services/prismic/transformers/` - Prismic transformers
- `content/webapp/services/` - API clients for catalogue, content, concepts

Use `@weco/` package names, not relative paths across package boundaries. If you see duplication, flag it and suggest the existing shared implementation.

## Prismic Conventions
<!-- https://app.gitbook.com/o/-LumfFcEMKx4gYXKAZTQ/s/451yLOIRTl5YiAJ88yIL/api-id-name-casing#future-api-id-naming -->
As the site has evolved we have introduced some inconsistencies in how we have named Prismic custom types, slices, and their fields. Some are kebab-case, some are camelCase and some are snake_case. Some are singular when they should have been plural. We put together an RFC to decide how we want to approach these names in future. We also discussed whether we wanted to unify what we already have but concluded that the effort and risk involved in changing existing API IDs wasn't worth it.

### Future API ID naming
- Custom type IDs should be kebab-case. Plural for repeatable types (e.g. `exhibition-highlight-tours`) and singular for singleton types (e.g. `global-alert`). This involves overriding the default snake_case ids that Prismic will suggest
- Field IDs for all Custom types and Slices should be camelCase (e.g. `datePublished`). This involves overriding the default snake_case ids that Prismic will suggest
- Slice IDs should be snake_case (e.g. `guide_section_heading`) — this is the default from Prismic and can't be overridden in the UI

## Server vs Client Code

Next.js code runs in both Node.js (server-side rendering) and the browser (client-side). When using Node.js-only APIs or packages:

- Use `typeof window === 'undefined'` to detect server-side context
- Use dynamic imports `await import()` for Node.js-only packages
- Add webpack config to exclude server-only packages from client bundles

Server-only packages that try to load in the browser will cause "Cannot find module" errors even with webpack exclusion. You need both webpack config AND runtime checks.

## PR Review Guidelines

When reviewing, check changes against the coding standards above (accessibility, duplication, naming, Prismic conventions).

### TODOs and Technical Debt

When you see new TODOs being added, ask whether this is the right time to add it or if it should be addressed in the current PR.

For existing TODOs in the code being changed, check whether they are still relevant. If a TODO is clearly obsolete or the work has already been completed, suggest removing or updating it; otherwise, leave it in place, but note any apparent staleness to the author.

### Documentation

When reviewing, check whether documentation needs updating:
- READMEs affected by new features, changed commands, or modified setup steps
- Files in `docs/` that relate to the changes
- Code comments that might be outdated by the changes
- API documentation if endpoints or contracts change
- The AGENTS.md and copilot-instructions.md files if the changes affect coding standards or instructions for Copilot

If the PR changes behaviour or adds features but doesn't update relevant docs, flag it.
