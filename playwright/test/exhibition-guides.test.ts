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

const jasonGuideId = 'jason-and-the-adventure-of-254';
const newJasonGuideRelativeURL = `/guides/exhibitions/${jasonGuideId}`;

test.describe.configure({ mode: 'parallel' });

test('(1) | Redirects to preferred format if user has an EG preference and comes from a QR code', async ({
  context,
  page,
}) => {
  // Jason with the QR code params and Stop #2
  await digitalGuide(
    `${jasonGuideId}?usingQRCode=true&stopNumber=2`,
    context,
    page,
    bslCookie
  );

  // Check we've been redirected to the BSL guide's second stop, and kept the extra params
  await expect(page).toHaveURL(/\/bsl\/2[?]usingQRCode=true/);
});

test('(2) | Does not redirect if user does not come from a QR code', async ({
  context,
  page,
}) => {
  // Jason with the QR code params and Stop #2
  await digitalGuide(`${jasonGuideId}?stopNumber=2`, context, page, bslCookie);

  // Nothing happens, URL is the same
  await expect(page).toHaveURL(
    /\/guides\/exhibitions\/jason-and-the-adventure-of-254[?]stopNumber=2/
  );
});

test('(3) | If first stop, redirects to preferred type landing page instead of [type]/jasonGuideId', async ({
  context,
  page,
}) => {
  // Jason with the QR code params and Stop #jasonGuideId
  await digitalGuide(
    `${jasonGuideId}?usingQRCode=true&stopNumber=jasonGuideId`,
    context,
    page,
    bslCookie
  );

  // Nothing happens, URL is the same
  await expect(page).toHaveURL(
    /\/guides\/exhibitions\/jason-and-the-adventure-of-254\/bsl/
  );
});

test.describe('(4) | If no type preference set, links to BSL and Audio on the EG landing page: ', () => {
  test('go straight to stop page instead of listing page', async ({
    context,
    page,
  }) => {
    // Jason with the QR code params and Stop #2
    await digitalGuide(
      `${jasonGuideId}?usingQRCode=true&stopNumber=2`,
      context,
      page,
      [
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
    // Jason with the QR code params and Stop #jasonGuideId
    await digitalGuide(
      `${jasonGuideId}?usingQRCode=true&stopNumber=jasonGuideId`,
      context,
      page,
      [
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
