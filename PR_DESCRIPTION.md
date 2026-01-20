## What does this change?

- Removes the custom Koa servers from the content and identity apps.
   - Both apps now create a plain Node `http` server and delegate requests to Next’s request handler.
- Moves previously-Koa-served endpoints into Next:
   - Content: adds Next API routes for `/rss` and `/preview`, and adds middleware to manage the `isPreview` cookie based on the `preview.` subdomain.
   - Identity: adds a Next API route healthcheck and a rewrite so the healthcheck can be requested via `/management/healthcheck`.
- Replaces identity request logging with Next middleware logging, keeping URL redaction via `redactUrl`.
- Removes no-longer-needed Koa dependencies from the webapps (`koa`, `@koa/router`) and cleans up related type/dependency entries (including `@types/koa`).

## How and what to test

1. Start the content app and sanity-check routing:

   ```bash
   yarn content

   curl -i http://localhost:3000/
   curl -i http://localhost:3000/content/management/healthcheck
   ```

2. Check content API routes that used to be served from the Koa router:

   ```bash
   curl -i http://localhost:3000/rss
   curl -i "http://localhost:3000/preview"
   ```

3. (If relevant to your change) verify preview-cookie behaviour:
   - With `Host: preview.localhost` (or equivalent), confirm the `isPreview=true` cookie gets set by the middleware.

4. Start the identity app and verify request logging:

   ```bash
   yarn identity
   ```

    - Confirm you see incoming/outgoing logs with timing (middleware-based), e.g.
       - `<-- GET /some/path`
       - `--> GET /some/path 5ms`
   - Confirm URL redaction works (session tokens/emails don’t appear in logs), e.g.
     - `/account/registration?session_token=[redacted]`

5. Check the identity healthcheck endpoint:

    ```bash
    # Depending on basePath handling, one of these should be the externally visible healthcheck.
    curl -i http://localhost:3003/management/healthcheck
    curl -i http://localhost:3003/account/management/healthcheck
    ```

6. Run unit tests + typecheck:

   ```bash
   yarn test:all:unit
   yarn tsc
   ```

## Risks

- Removing the Koa server changes request handling order; any route that previously relied on Koa middleware ordering could behave differently.
- Identity logging moved to Next middleware; the log format and available fields may differ (e.g. middleware doesn’t have access to response status/length in the same way).
- Healthcheck exposure depends on Next rewrite/basePath behaviour; verify the load balancer is still hitting the intended URL.
- Preview behaviour relies on middleware and/or `/preview` API route; confirm cookies/redirects still work for real preview links.

## What does success look like

- `yarn content` and `yarn identity` start successfully.
- `yarn test:all:unit` and `yarn tsc` pass.
- Content routes (including `/rss` and `/preview`) work as expected.
- Identity healthcheck returns `200` with valid JSON.
- Identity logs appear and continue to redact PII.
- `koa` and `@koa/router` are no longer required by the webapps.
