# Robots.txt Strategy for Different Environments

## Overview

We serve different `robots.txt` content based on the deployment environment to prevent staging/dev environments from being indexed by search engines while allowing production to be crawled.

## Implementation Details

### 1. Environment-Specific Robots Files

Located in `/config/robots/`:
- **`robots.prod.txt`** - Production: Allows crawlers (except specific bots)
- **`robots.stage.txt`** - Staging: Blocks all crawlers
- **`robots.dev.txt`** - Development/E2E: Blocks all crawlers

### 2. Dynamic Serving via Next.js API Routes

**Shared Logic:** `/common/utils/robots.ts`  
Contains the centralized handler that:
- Reads the `APM_ENVIRONMENT` variable set by Terraform
- Selects the appropriate robots file based on environment
- Serves it with proper headers and caching
- Defaults to blocking all crawlers if file read fails

**API Route Wrappers:**  
- `/content/webapp/pages/api/robots.ts`
- `/identity/webapp/pages/api/robots.ts`

These are thin wrappers that import and export the shared handler from common, avoiding code duplication while meeting Next.js file-system routing requirements

### 3. URL Rewrites

**Content:** `/content/webapp/next.config.js`  
**Identity:** `/identity/webapp/next.config.js`

Rewrites `/robots.txt` → `/api/robots` to serve the dynamic content.

### 4. Noindex Meta Tag (Layer 4)

**Implementation:** `/common/views/pages/_document.tsx`

Adds `<meta name="robots" content="noindex, nofollow">` to all pages in non-production environments. This provides:
- Defense in depth: Even if robots.txt is ignored, the meta tag prevents indexing
- Per-page control over crawler behavior
- Compliance with robots meta tag standard

## Environment Detection

The environment is determined by the `APM_ENVIRONMENT` variable:
- Set in Terraform: `/content/terraform/stack/main.tf` and `/identity/terraform/stack/main.tf`
- Values: `prod`, `stage`, `e2e`, or `dev` (default for local)
- Available at runtime in both API routes and server-side rendering

## Asset Deployment

**Script:** `/assets/deploy_assets.sh`

The S3 asset deployment script has been updated to **not** deploy robots.txt to S3, as it's now served dynamically from the Next.js applications.

## Testing

### Local Development
```bash
# Start the content app
yarn content

# Test robots.txt endpoint
curl http://localhost:3000/robots.txt

# You should see the dev version (blocks all crawlers)
```

### Different Environments
The same Docker image is deployed to all environments, but serves different robots.txt based on the `APM_ENVIRONMENT` variable set by the infrastructure.

## Benefits of This Approach

1. **Single Docker image** - Same build deployed to all environments
2. **Runtime environment detection** - No build-time baking required
3. **Defense in depth** - Both robots.txt and noindex meta tags
4. **Version controlled** - All robots files tracked in git
5. **Fallback safety** - Defaults to blocking if errors occur
6. **Cache-friendly** - 1-hour cache on robots.txt responses

## Related Files

- Environment-specific robots: `/config/robots/*.txt`
- Shared handler logic: `/common/utils/robots.ts`
- API routes: `/content/webapp/pages/api/robots.ts`, `/identity/webapp/pages/api/robots.ts`
- Next.js config: `*/webapp/next.config.js`
- Meta tag implementation: `/common/views/pages/_document.tsx`
- Infrastructure: `*/terraform/stack/main.tf`
- Asset deployment: `/assets/deploy_assets.sh`

## Future Considerations

- Monitor CloudFront caching behavior with robots.txt
- Consider adding environment indicator in HTML comments for debugging
- Review and update bot blocklist in robots.prod.txt as needed
