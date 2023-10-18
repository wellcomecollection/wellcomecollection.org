// TODO Rewrite as part of https://github.com/wellcomecollection/wellcomecollection.org/issues/10338
// We found out that using test content for this was not realistic so we need real static content.

// import { test as base, expect } from '@playwright/test';
// import { visualStory } from './contexts';
// import { baseUrl } from './helpers/urls';
// import { makeDefaultToggleCookies } from './helpers/utils';

// const domain = new URL(baseUrl).host;

// const test = base.extend({
//   context: async ({ context }, use) => {
//     const defaultToggleCookies = await makeDefaultToggleCookies(domain);
//     await context.addCookies([
//       { name: 'WC_cookiesAccepted', value: 'true', domain, path: '/' },
//       ...defaultToggleCookies,
//     ]);
//     await use(context);
//   },
// });
