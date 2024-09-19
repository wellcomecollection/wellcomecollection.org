import { expect, test } from '@playwright/test';

import { CookieProps, digitalGuide } from './helpers/contexts';
import { baseUrl } from './helpers/utils';

const bslCookie: CookieProps[] = [
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

const newJasonGuideId = 'ZthrZRIAACQALvCC';
const newJasonGuideRelativeURL = `/guides/exhibitions/${newJasonGuideId}`;

test.describe.configure({ mode: 'parallel' });

// TODO remove when we stop supporting legacy QRs
// https://github.com/wellcomecollection/wellcomecollection.org/issues/11131
test('(1) | Redirects to another format if we have an EG preference and come from a QR code', async ({
  context,
  page,
}) => {
  // Go to In Plain Sight Audio exhibition guide with the QR code params
  await digitalGuide(
    'YzwsAREAAHylrxau/audio-without-descriptions?usingQRCode=true&stopId=witness#witness',
    context,
    page,
    egWorkCookies
  );

  // Check we've been redirected to the BSL guide and kept the extra params
  await expect(page).toHaveURL(
    /\/bsl[?]usingQRCode=true&stopId=witness#witness/
  );
});

test.describe('(2) | with egWork toggle: ', () => {
  // TODO remove this when we stop supporting legacy QRs
  // https://github.com/wellcomecollection/wellcomecollection.org/issues/11131
  test('Legacy: Still redirects to another format if we have an EG preference and come from a QR code', async ({
    context,
    page,
  }) => {
    // Go to In Plain Sight Audio exhibition guide with the QR code params
    await digitalGuide(
      'YzwsAREAAHylrxau/audio-without-descriptions?usingQRCode=true&stopId=witness#witness',
      context,
      page,
      egWorkCookies
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
    // Jason with the QR code params and Stop #2
    await digitalGuide(
      `${newJasonGuideId}?usingQRCode=true&stopNumber=2`,
      context,
      page,
      egWorkCookies
    );

    // Check we've been redirected to the BSL guide's second stop, and kept the extra params
    await expect(page).toHaveURL(/\/bsl\/2[?]usingQRCode=true/);
  });

  test('New: Does not redirect if user does not come from a QR code', async ({
    context,
    page,
  }) => {
    // Jason with the QR code params and Stop #2
    await digitalGuide(
      `${newJasonGuideId}?stopNumber=2`,
      context,
      page,
      egWorkCookies
    );

    // Nothing happens, URL is the same
    await expect(page).toHaveURL(
      /\/guides\/exhibitions\/ZthrZRIAACQALvCC[?]stopNumber=2/
    );
  });

  test('New: If first stop, redirects to preferred type landing page instead of [type]/1', async ({
    context,
    page,
  }) => {
    // Jason with the QR code params and Stop #1
    await digitalGuide(
      `${newJasonGuideId}?usingQRCode=true&stopNumber=1`,
      context,
      page,
      egWorkCookies
    );

    // Nothing happens, URL is the same
    await expect(page).toHaveURL(
      /\/guides\/exhibitions\/ZthrZRIAACQALvCC\/bsl/
    );
  });

  test.describe('New: If no type preference set, links to BSL and Audio on the EG landing page: ', () => {
    test('go straight to stop page instead of listing page', async ({
      context,
      page,
    }) => {
      // Jason with the QR code params and Stop #2
      await digitalGuide(
        `${newJasonGuideId}?usingQRCode=true&stopNumber=2`,
        context,
        page,
        [
          {
            name: 'toggle_egWork',
            value: 'true',
            path: '/',
            domain: new URL(baseUrl).host,
          },
          {
            name: 'CookieControl',
            value: '{}',
            path: '/',
            domain: new URL(baseUrl).host,
          }, // Civic UK banner
        ]
      );

      await expect(
        page.getByRole('link', { name: 'Listen to audio' }).first()
      ).toHaveAttribute(
        'href',
        `${newJasonGuideRelativeURL}/audio-without-descriptions/2`
      );

      await expect(
        page.getByRole('link', { name: 'Watch British Sign Language' }).first()
      ).toHaveAttribute('href', `${newJasonGuideRelativeURL}/bsl/2`);
    });

    test('unless it is the first stop', async ({ context, page }) => {
      // Jason with the QR code params and Stop #1
      await digitalGuide(
        `${newJasonGuideId}?usingQRCode=true&stopNumber=1`,
        context,
        page,
        [
          {
            name: 'toggle_egWork',
            value: 'true',
            path: '/',
            domain: new URL(baseUrl).host,
          },
          {
            name: 'CookieControl',
            value: '{}',
            path: '/',
            domain: new URL(baseUrl).host,
          }, // Civic UK banner
        ]
      );

      await expect(
        page.getByRole('link', { name: 'Listen to audio' }).first()
      ).toHaveAttribute(
        'href',
        `${newJasonGuideRelativeURL}/audio-without-descriptions`
      );

      await expect(
        page.getByRole('link', { name: 'Watch British Sign Language' }).first()
      ).toHaveAttribute('href', `${newJasonGuideRelativeURL}/bsl`);
    });
  });
});
