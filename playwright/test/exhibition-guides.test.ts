import { test, expect } from '@playwright/test';
import { baseUrl } from './helpers/utils';
import { gotoWithoutCache } from './helpers/contexts';

const bslCookie = [
  {
    name: 'WC_userPreferenceGuideType',
    value: 'bsl',
    path: '/',
    domain: new URL(baseUrl).host,
  },
];

// TODO remove when we remove the egWork toggle
const egWorkCookies = [
  ...bslCookie,
  {
    name: 'toggle_egWork',
    value: 'true',
    path: '/',
    domain: new URL(baseUrl).host,
  },
];

test.describe.configure({ mode: 'parallel' });

// TODO remove when we stop supporting legacy QRs
test('(1) | Redirects to another format if we have an EG preference and come from a QR code', async ({
  context,
  page,
}) => {
  // Add cookie for BSL preference
  await context.addCookies(bslCookie);

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

test.describe('(2) | with egWork toggle: ', () => {
  // TODO remove this when we stop supporting legacy QRs
  test('Legacy: Still redirects to another format if we have an EG preference and come from a QR code', async ({
    context,
    page,
  }) => {
    // Add cookie for BSL preference
    await context.addCookies(egWorkCookies);

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

  test('New: Redirects to preferred format if user has an EG preference and comes from a QR code', async ({
    context,
    page,
  }) => {
    await context.addCookies(egWorkCookies);

    // Kola Nuts with the QR code params and Stop #2
    await gotoWithoutCache(
      `${baseUrl}/guides/exhibitions/ZrHvtxEAACYAWmfc?usingQRCode=true&stopNumber=2`,
      page
    );

    // Check we've been redirected to the BSL guide's second stop, and kept the extra params
    await expect(page).toHaveURL(/\/bsl\/2[?]usingQRCode=true/);
  });

  test('New: Does not redirect if user does not come from a QR code', async ({
    context,
    page,
  }) => {
    await context.addCookies(egWorkCookies);

    //  Kola Nuts with the QR code params and Stop #2
    await gotoWithoutCache(
      `${baseUrl}/guides/exhibitions/ZrHvtxEAACYAWmfc?stopNumber=2`,
      page
    );

    // Nothing happens, URL is the same
    await expect(page).toHaveURL(
      /\/guides\/exhibitions\/ZrHvtxEAACYAWmfc[?]stopNumber=2/
    );
  });

  test('New: If first stop, redirects to preferred type landing page instead of [type]/1', async ({
    context,
    page,
  }) => {
    await context.addCookies(egWorkCookies);

    //  Kola Nuts with the QR code params and Stop #1
    await gotoWithoutCache(
      `${baseUrl}/guides/exhibitions/ZrHvtxEAACYAWmfc?usingQRCode=true&stopNumber=1`,
      page
    );

    // Nothing happens, URL is the same
    await expect(page).toHaveURL(
      /\/guides\/exhibitions\/ZrHvtxEAACYAWmfc\/bsl/
    );
  });

  // TODO uncomment this once we have content for it in production
  // Currently only works with Prismic staging content, but it is a good test to have.
  // test.describe('New: If no type preference set, ', () => {
  //   test('links to BSL and Audio now go straight to stop page instead of landing', async ({
  //     context,
  //     page,
  //   }) => {
  //     await context.addCookies([
  //       {
  //         name: 'toggle_egWork',
  //         value: 'true',
  //         path: '/',
  //         domain: new URL(baseUrl).host,
  //       },
  //       {
  //         name: 'CookieControl',
  //         value: '{}',
  //         path: '/',
  //         domain: new URL(baseUrl).host,
  //       }, // Civic UK banner
  //     ]);

  //     //  Kola Nuts with the QR code params and Stop #2
  //     await gotoWithoutCache(
  //       `${baseUrl}/guides/exhibitions/ZrHvtxEAACYAWmfc?usingQRCode=true&stopNumber=2`,
  //       page
  //     );

  //     await expect(
  //       page.getByRole('link', { name: 'Audio descriptive tour with' })
  //     ).toHaveAttribute(
  //       'href',
  //       '/guides/exhibitions/ZrHvtxEAACYAWmfc/audio-without-descriptions/2'
  //     );

  //     await expect(
  //       page.getByRole('link', { name: 'British Sign Language tour' })
  //     ).toHaveAttribute('href', '/guides/exhibitions/ZrHvtxEAACYAWmfc/bsl/2');
  //   });

  //   test('unless it is the first stop', async ({ context, page }) => {
  //     await context.addCookies([
  //       {
  //         name: 'toggle_egWork',
  //         value: 'true',
  //         path: '/',
  //         domain: new URL(baseUrl).host,
  //       },
  //       {
  //         name: 'CookieControl',
  //         value: '{}',
  //         path: '/',
  //         domain: new URL(baseUrl).host,
  //       }, // Civic UK banner
  //     ]);

  //     //  Kola Nuts with the QR code params and Stop #1
  //     await gotoWithoutCache(
  //       `${baseUrl}/guides/exhibitions/ZrHvtxEAACYAWmfc?usingQRCode=true&stopNumber=1`,
  //       page
  //     );

  //     await expect(
  //       page.getByRole('link', { name: 'Audio descriptive tour with' })
  //     ).toHaveAttribute(
  //       'href',
  //       '/guides/exhibitions/ZrHvtxEAACYAWmfc/audio-without-descriptions'
  //     );

  //     await expect(
  //       page.getByRole('link', { name: 'British Sign Language tour' })
  //     ).toHaveAttribute('href', '/guides/exhibitions/ZrHvtxEAACYAWmfc/bsl');
  //   });
  // });
});
