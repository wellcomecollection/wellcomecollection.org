import { test as base, expect } from '@playwright/test';
import { visualStory } from './contexts';
import { baseUrl } from './helpers/urls';
import { makeDefaultToggleCookies } from './helpers/utils';

const domain = new URL(baseUrl).host;

const test = base.extend({
  context: async ({ context }, use) => {
    const defaultToggleCookies = await makeDefaultToggleCookies(domain);
    await context.addCookies([
      { name: 'WC_cookiesAccepted', value: 'true', domain, path: '/' },
      ...defaultToggleCookies,
    ]);
    await use(context);
  },
});

test.describe('visual-stories', () => {
  test('if it has a related document, it redirects to the relevant URL', async ({
    page,
    context,
  }) => {
    await visualStory('ZLe87hAAACIAwzqH', context, page);

    expect(page.url()).toBe(
      `${baseUrl}/exhibitions/Wt4AACAAAFCxRfQM/visual-stories`
    );
  });
});
