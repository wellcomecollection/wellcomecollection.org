import { test, expect } from '@playwright/test';
import { baseUrl } from './helpers/utils';
import { gotoWithoutCache } from './helpers/contexts';

test('Redirects to another format if we have an EG preference and come from a QR code', async ({
  context,
  page,
}) => {
  // Add cookie for BSL preference
  await context.addCookies([
    {
      name: 'WC_userPreferenceGuideType',
      value: 'bsl',
      path: '/',
      domain: new URL(baseUrl).host,
    },
  ]);

  // Go to In Plain Sight Audio exhibition guide with the QR code params
  await gotoWithoutCache(
    `${baseUrl}/guides/exhibitions/YzwsAREAAHylrxau/audio-without-descriptions?usingQRCode=true&stopId=witness#witness`,
    page
  );

  // Check we've been redirected to the BSL guide and kept the extra params
  await expect(page).toHaveURL(
    /\/bsl[?]usingQRCode=true&stopId=witness#witness/
  );
});
