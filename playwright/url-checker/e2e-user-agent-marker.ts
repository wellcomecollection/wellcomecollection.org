// GoogleTagManager (common/services/app/analytics-scripts/google-analytics.tsx)
// skips loading GTM at all when this marker is present in the User-Agent, so
// automated traffic from this workspace - Playwright test runs and the
// url-checker - doesn't pollute analytics data, including against prod.
//
// Can't be imported from @weco/common: playwright/Dockerfile only ever
// copies the playwright/ folder into the e2e test image, with no access to
// the rest of the monorepo's workspaces. Kept in sync by hand with
// E2E_TEST_USER_AGENT_MARKER in that file.
export const E2E_TEST_USER_AGENT_MARKER = 'wellcomecollection-e2e-test';
