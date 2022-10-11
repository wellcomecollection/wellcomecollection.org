import { test as base, expect } from '@playwright/test';
import { makeDefaultToggleCookies } from './helpers/utils';
import { baseUrl } from './helpers/urls';

const domain = new URL(baseUrl).host;

const test = base.extend({
  context: async ({ context }, use) => {
    const defaultToggleCookies = await makeDefaultToggleCookies(domain);
    await context.addCookies([
      { name: 'WC_exhibitionGuides', value: 'true', domain: domain, path: '/' },
      ...defaultToggleCookies,
    ]);
    await use(context);
  },
});

test.describe('User preferences and redirections in exhibition guides', () => {
  test('it works', () => {
    expect(true).toBe(true);
  });
});
