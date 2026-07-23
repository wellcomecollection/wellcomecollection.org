# Wellcome Collection Development Guidelines

**These guidelines are for active development and coding tasks.** Shared coding standards and PR review guidelines are in [.github/copilot-instructions.md](.github/copilot-instructions.md).

Guidelines for AI assistants working on the Wellcome Collection codebase. Shared coding standards (naming, accessibility, duplication, workspace structure, Prismic conventions):

@.github/copilot-instructions.md

The sections below cover agent-specific operational guidance.

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
yarn content    # runs content webapp, http://localhost:3000
yarn identity   # runs identity webapp
yarn cardigan   # runs the design system
yarn dash       # runs the internal dashboard (yarn workspace @weco/dash run dev)
```

Both apps can run together: `(yarn content & yarn identity)`. Both need matching `NEXT_PUBLIC_API_ENV_OVERRIDE` values in their `.env` files.

Run `yarn config-local-apis` to configure nginx proxying so the webapps can hit local dev APIs (see [README.md](./README.md#running-the-app-with-local-apis) for the full override precedence rules).

To deploy a local build straight to staging, bypassing CI (coordinate with the team first, and restore afterwards): `yarn deploy-dev content` / `yarn deploy-dev restore content`.

### Type checking
```bash
yarn tsc        # from root - checks TypeScript across all packages
```

### Testing
```bash
yarn test:common          # jest in common/
yarn test:content         # jest in content/webapp
yarn test:identity        # jest in identity/webapp
yarn test:all:unit        # all three of the above
yarn test:playwright        # e2e against staging
yarn test:playwright:mobile # e2e against staging, mobile viewport
```

To run a single test file, `cd` into the relevant workspace (e.g. `content/webapp` or `common`) and run:
```bash
yarn test path/to/File.test.ts
```

### Documentation

Key documentation files:
- [playwright/README.md](./playwright/README.md) - E2E testing with Playwright, user stories approach
- [docs/testing-the-site-on-dates-that-arent-right-now.md](./docs/testing-the-site-on-dates-that-arent-right-now.md) - How to test date logic
- [common/README.md](./common/README.md) - About shared code structure, data directory, Prismic conventions
- [docs/git-hooks.md](./docs/git-hooks.md) - Git hooks with Husky (pre-commit linting)
- [docs/](./docs/) - Additional feature-specific documentation

## Architecture

Yarn Workspaces monorepo. Main workspaces:

- `common/` — shared code (`@weco/common`): components, hooks, services, utils, types, and the Prismic model (`customtypes/`, `views/slices/`) generated via SliceMachine. Also owns the koa-middleware and server-data pipeline used by both webapps.
- `content/webapp/` — the main public site (`@weco/content`): stories, exhibitions, events, catalogue/works, search, concepts, guides. Next.js app with a custom Koa server (`app.ts`).
- `identity/webapp/` — account management (`@weco/identity`): login, registration, library membership.
- `toggles/webapp/` — feature flag / A-B test definitions, compiled and deployed to S3, served at `toggles.wellcomecollection.org` and displayed on the toggles dashboard.
- `dash/webapp/` — internal dashboard, including the toggles UI.
- `cardigan/` — the design system.
- `cache/` — CloudFront / Lambda@Edge config, including the A/B test cohort assignment (`cache/edge_lambdas/src/toggler.ts`).
- `deploy/` — deployment tooling (`yarn deploy-dev`).
- `infrastructure/` — Terraform for the experience AWS account.
- `prismic-model/` — shared Prismic type definitions.

### Server architecture (content & identity)

Both webapps run Next.js behind a custom Koa server (see `content/webapp/app.ts`):
- `require('@weco/common/services/apm/initApm')(...)` must be the first thing loaded (APM instrumentation).
- Koa middleware chain: `apmErrorMiddleware` then `withCachedValues` (from `common/koa-middleware`), which currently composes `withPrismicPreviewStatus` — this is where request-scoped data (like Prismic preview state) gets attached before Next.js handles the request.
- `initServerData()` (`common/server-data`) runs once at boot and is the source of the `serverData` object (including `serverData.toggles`) available in `getServerSideProps`.
- Routing is case-sensitive (`sensitive: true` on the Koa router) — deliberate, because Prismic generates near-identical document IDs differing only in case.
- `/rss` is served directly by this Koa server (backed by `rss.wellcomecollection.org` via CloudFront) rather than through a Next.js page.

### Toggles (feature flags, A/B tests & modes)

Three categories, all defined in `toggles/webapp/toggles.ts`:
- **Feature flags** (`experimental` / `permanent` / `stage`) — boolean, with a `defaultValue`. Add one by appending to `featureFlags` with `initialValue: false`, then `yarn deploy` from `toggles/webapp` to publish to S3/the dashboard.
- **A/B tests** — cohort assignment happens in the Lambda@Edge layer (`cache/edge_lambdas/src/toggler.ts`), not in the webapp.
- **Modes** — like a feature flag but the value is a selected option string rather than a boolean, activated via a cookie holding the chosen option's `id`. Defined in the `modes` array (e.g. `kioskMode` for Reading Room / Tenderness & Rage devices, `cataloguePipeline` for routing catalogue API queries to a specific Elasticsearch cluster via an `elasticCluster` param).

Access patterns:
- Client-side: `useFeatureFlags()` / `useABTest()` / `useModes()` from `@weco/common/server-data/Context`.
- Server-side: `serverData.toggles.someFlag.value` (or `serverData.toggles.modes.someMode`) inside `getServerSideProps`; the same `serverData.toggles` object is threaded into API clients (catalogue, etc.) that need toggle- or mode-gated behaviour.
- Server-side toggle *cookie* resolution (`common/server-data/toggles.ts`) validates against the deployed `toggles.wellcomecollection.org/toggles.json` — a flag or mode added locally to `toggles.ts` won't resolve from its cookie until the toggles package has actually been deployed.

### API environment overrides (local dev against real APIs)

Which environment (`prod`/`stage`/`dev`) each backend API is hit from, precedence high to low:
1. `toggles?.stagingApi` unset → everything is `prod`.
2. `toggles?.stagingApi` true → everything is `stage`.
3. `NEXT_PUBLIC_API_ENV_OVERRIDE` → applies to content, concepts, and catalogue APIs together.
4. Per-API overrides: `NEXT_PUBLIC_CONTENT_API_ENV_OVERRIDE`, `NEXT_PUBLIC_CONCEPTS_API_ENV_OVERRIDE`, `NEXT_PUBLIC_CATALOGUE_API_ENV_OVERRIDE`.

### Prismic integration

Content is authored in Prismic. Key layers, all under `content/webapp/services/prismic/`:
- `fetch/` — Prismic client fetch helpers, `fetch-links.ts` for GraphQuery fetch-link configuration.
- `transformers/` — convert raw Prismic documents into the app's view models.
- `events.ts` — event-specific Prismic queries/logic.

`common/customtypes` and `common/views/slices` are the SliceMachine-managed Prismic model (custom types and slices); regenerate/edit these via SliceMachine (`yarn slicemachine`), not by hand, when adding fields. See the "Future API ID naming" conventions in `.github/copilot-instructions.md` before adding new custom types, slices, or fields.

### Catalogue / IIIF

`content/webapp/services/wellcome/catalogue` talks to the Catalogue API (works, images). `content/webapp/services/iiif` fetches and transforms IIIF manifests for viewing digitised items.

### CI / deployment

Buildkite pipelines live in `.buildkite/` (`pipeline.yml` main, `pipeline.deployment.yml`, `pipeline.e2e-universal.yml`). To reproduce a CI build step locally, run the matching `docker compose` service (see [README.md](./README.md#running-ci-steps-locally) for the full walkthrough of mounting AWS credentials and using the `experience-ci` role).

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
- **Have we considered potential risks?** - Potential risks, mitigations, and whether alarms are needed

When writing PR descriptions, follow this structure and provide enough detail for the PR to be understandable in the future.
