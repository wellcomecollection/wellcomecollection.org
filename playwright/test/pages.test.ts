import { expect, test } from '@playwright/test';

import { gotoWithoutCache, requiredCookies } from './helpers/contexts';
import { baseUrl } from './helpers/utils';

test.describe('Server-side redirection logic works as expected', () => {
  test('/pages/ route redirects to relevant URL', async ({ context, page }) => {
    await context.addCookies(requiredCookies);

    // Visit Us site section
    await gotoWithoutCache(`${baseUrl}/pages/accessibility`, page);
    await expect(page.url()).toEqual(`${baseUrl}/visit-us/accessibility`);

    // Orphan page
    await gotoWithoutCache(`${baseUrl}/pages/contact-us`, page);
    await expect(page.url()).toEqual(`${baseUrl}/contact-us`);
  });

  test("Landing pages don't have a parent route", async ({ context, page }) => {
    await context.addCookies(requiredCookies);

    await gotoWithoutCache(`${baseUrl}/visit-us/visit-us`, page);
    await expect(
      page
        .getByRole('heading')
        .getByText('Not the Wellcome you were expecting?')
    ).toBeVisible();

    await gotoWithoutCache(`${baseUrl}/pages/visit-us`, page);
    await expect(page.url()).toEqual(`${baseUrl}/visit-us`);
  });
});

// As they are displayed through a hack, we want to make sure they're working
// https://github.com/wellcomecollection/wellcomecollection.org/pull/10890
test('Cookie policy tables are showing', async ({ context, page }) => {
  await context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/about-us/cookie-policy`, page);

  await expect(page.getByRole('table')).toHaveCount(3);
});
