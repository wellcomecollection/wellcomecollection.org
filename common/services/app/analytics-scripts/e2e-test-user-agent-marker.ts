// Playwright appends this to its real browser UA (playwright/playwright.config.ts)
// so e2e runs, including against prod, can be told apart from real visitors.
// It's a plain .ts file (no JSX) so playwright/ - which has no `jsx` compiler
// option set - can import it directly without pulling in GoogleTagManager's
// React component code.
export const E2E_TEST_USER_AGENT_MARKER = 'wellcomecollection-e2e-test';
