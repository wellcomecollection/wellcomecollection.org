import { test as base, expect } from '@playwright/test';

// Every test in this suite runs against real environments, including prod,
// so GTM/GA network requests are dropped before they're sent rather than
// relying on the app to recognise e2e traffic and skip loading them itself.
//
// A test that genuinely needs the real GTM container to load (e.g. to check
// its trigger config) can opt out for its own scope with
// test.use({ blockAnalytics: false }).
export const test = base.extend<{ blockAnalytics: boolean }>({
  blockAnalytics: [true, { option: true }],
  context: async ({ context, blockAnalytics }, use) => {
    if (blockAnalytics) {
      // Explicitly 'aborted' (net::ERR_ABORTED) rather than the default
      // 'failed' (net::ERR_FAILED) - this is a deliberate abort, not a
      // generic connection failure, and url-checker's own request-failure
      // handling (a separate context, see url-checker/check-url.ts) only
      // tolerates net::ERR_ABORTED as expected/ignorable.
      await context.route(
        /googletagmanager\.com|google-analytics\.com/,
        route => route.abort('aborted')
      );
    }
    await use(context);
  },
});

export { expect };
