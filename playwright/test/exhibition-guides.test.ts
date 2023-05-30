import { test as base, expect } from '@playwright/test';
import { makeDefaultToggleCookies } from './helpers/utils';
import { baseUrl } from './helpers/urls';
import { gotoWithoutCache } from './contexts';
import { expectItemIsVisible } from './asserts/common';

const domain = new URL(baseUrl).host;

const IN_PLAIN_SIGHT = 'YzwsAREAAHylrxau';

const test = base.extend({
  context: async ({ context }, use) => {
    const defaultToggleCookies = await makeDefaultToggleCookies(domain);
    await context.addCookies([
      { name: 'WC_exhibitionGuides', value: 'true', domain, path: '/' },
      ...defaultToggleCookies,
    ]);
    await use(context);
  },
});

test.describe('User preferences and redirections in exhibition guides', () => {
  test.skip('shows a single exhibition guide', async ({ page }) => {
    await gotoWithoutCache(
      `${baseUrl}/guides/exhibitions/${IN_PLAIN_SIGHT}/audio-without-descriptions`,
      page
    );

    // Check we're looking at the audio-without-descriptions guide
    await expectItemIsVisible('div >> text="Listen to audio"', page);
  });

  test.skip('redirects to another format if we have a preference and come from a QR code', async ({
    context,
    page,
  }) => {
    await context.addCookies([
      {
        name: 'WC_userPreferenceGuideType',
        value: 'bsl',
        path: '/',
        domain: new URL(baseUrl).host,
      },
    ]);

    await gotoWithoutCache(
      `${baseUrl}/guides/exhibitions/${IN_PLAIN_SIGHT}/audio-without-descriptions?usingQRCode=true&stopId=witness#witness`,
      page
    );

    // Check we've been redirected to the BSL guide
    expect(
      page
        .url()
        .startsWith(
          `${baseUrl}/guides/exhibitions/${IN_PLAIN_SIGHT}/bsl?usingQRCode=true&stopId=witness#witness`
        )
    ).toBe(true);
    await expectItemIsVisible('div >> text="Watch BSL videos"', page);
  });
});
