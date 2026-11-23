# Wellcome Collection Coding Standards

These guidelines are read by all Copilot surfaces (IDE agent, PR reviewer, cloud agent). For agent-specific operational guidelines (build commands, working style), see [AGENTS.md](../AGENTS.md).

Use British English spelling throughout everything that is not code (e.g. CSS values are in American English).

## Writing

Where the surrounding context doesn't already make it clear, say which `Next`, `Back` or `page` is meant, in prose, comments and test names. Image search has a Next/Previous button in the sidebar, Next/Previous page links in the pagination, and Next.js, all at once; `Back` is either the browser's or a control in the UI; a `page` is either a page of results or the browser page. Write "the sidebar's Next button", "the browser's Back", "a page of results".

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
- Test files: same name as source with `.test.ts` / `.test.tsx` suffix (match the source extension, e.g. `Component.tsx` → `Component.test.tsx`) - except when the test itself needs JSX (e.g. a context-provider wrapper for a hook test), which takes `.tsx` regardless of the source file's own extension
- Type declarations: `.d.ts` extension for ambient declarations
- Service/utility folders: use `index.ts` as the main export point
- Phased flag phases: id `phase1`, `phase2`, ... and label `Phase 1`, `Phase 2`, ... Only `archiveBrowsingPhases` and `thematicBrowsingPhases` keep their older ids (`mvp`, `categoryPages`, `subCategoryPages`), because those are in cookies and links; flag any new phase that doesn't follow the convention
- Booleans derived from a toggle (feature flag or phased flag) that gate rendering: name them `show<FlagName>`, after the flag itself rather than the UI element it happens to control (e.g. `showThematicBrowsing`, not `shouldShowMoreLink`) - keeps the name traceable back to the toggle dashboard entry
- Module-level constants: `SCREAMING_SNAKE_CASE` (`ZOOM_STEP`, `CLICK_TOLERANCE_PX`, `SOURCE_BOX_WIDTH`). A few older files use camelCase for these - follow the convention in anything new rather than the file you happen to be in

## JSX

Boolean props go after the props carrying the data, and before any shorthand ones. Lint enforces the shorthand half (`react/jsx-sort-props` with `shorthandLast`) but has nothing to say about a boolean written with an explicit value, so that one sits between the two: `<X a={1} hidden={false} isOpen />` passes, `<X a={1} isOpen hidden={false} />` doesn't.

## Comments

Comment what the code can't say for itself. If a reader would get the same thing from the line below, the comment is noise - it's one more thing to keep true, and it goes stale quietly.

Worth writing down:
- A constraint the code can't show: a browser bug being worked around, an ordering that matters, a value that has to match something elsewhere
- A domain fact recorded nowhere else, e.g. why the API gives us a field in a particular shape
- What something is for, where that isn't clear from its name. A link to the PR or issue beats retelling the whole story

Not worth writing down:
- Names. Props, constants and functions whose names already say what they are don't need a line restating it - `showAllText?: string` and `MAX_VISIBLE_SUBJECTS = 10` are clear on their own. Save the comment for the part that would surprise someone, like a `maxVisible` prop that doesn't just truncate a list but puts a control after it
- Test steps. A comment narrating the next line (`// Click the button`, `// Check the heading is visible`) says less than the line does, and the test name is usually the better place for it. Do comment what the code can't show: why a wait is there, what a test is working around, why an assertion is written the odd way
- Function openers. A JSDoc block that restates the signature adds nothing. Write one where there's a contract worth stating - what it assumes, what it returns in the awkward cases, what it touches besides its return value
- CSS declarations. `/* Centre the label */` above `display: flex; align-items: center;` is the declaration again. Give the reason instead: what it lines up with, which browser needs it, what breaks without it

Inside a type or props literal, a comment that does earn its place sits directly above its field, with no blank line separating them.

When tidying comments, keep anything recording something the code doesn't, and don't harden a hedge into a fact - if the original said a thing "seems to" happen, leave it saying that.

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

## E2E Testing (Playwright)

Playwright tests (`playwright/test/**/*.test.ts`) run against real environments, including prod. New test files must import `test`/`expect` from `playwright/test/helpers/analytics-blocking.ts` rather than directly from `@playwright/test` - that fixture drops GTM/GA network requests by default, so these runs don't send real traffic to analytics. Importing `@playwright/test` directly skips that protection silently: nothing fails, GTM just quietly loads for real. A test that genuinely needs the real GTM container to load can opt out for its own scope with `test.use({ blockAnalytics: false })`.

## Analytics Tracking (GTM)

Our analyst's GTM tags and reports depend on `data-gtm-*` attributes (`data-gtm-trigger`, `data-gtm-label` etc.), set either directly or via `dataGtmPropsToAttributes` (taking a `DataGtmProps` object) from `@weco/common/utils/gtm`. GTM listens for these on specific elements, so moving an attribute to a different element (e.g. off an `<a>` onto a wrapper) silently breaks tracking, even if the attribute still exists.

Don't add, remove, rename or move these attributes, change their values, or restructure the element that carries one, without flagging it to the user so they can let the analyst know. When reviewing, call out any diff that does this.

## PR Review Guidelines

When reviewing, check changes against the coding standards above (accessibility, duplication, naming, comments, Prismic conventions, e2e analytics-blocking, GTM attribute changes).

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
