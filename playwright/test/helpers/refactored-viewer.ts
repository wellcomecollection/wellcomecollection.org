import { test as base } from '@playwright/test';

import { requiredCookies } from './contexts';
import { baseUrl } from './utils';

// Extends the base test fixture to add the itemViewerRefactor toggle cookie
// to the browser context before each test. Use this in place of the standard
// `test` import to run viewer tests against the refactored implementation.
export const test = base.extend({
  context: async ({ context }, use) => {
    await context.addCookies([
      ...requiredCookies,
      {
        name: 'toggle_itemViewerRefactor',
        value: 'true',
        path: '/',
        domain: new URL(baseUrl).host,
      },
    ]);
    await use(context);
  },
});

export { expect } from '@playwright/test';
