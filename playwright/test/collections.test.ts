import { expect, test } from '@playwright/test';

import { newOnline } from './helpers/contexts';

test.describe('New online listing page displays a limited and controlled amount of results', () => {
  test('Only 4 pages of works are displayed', async ({ context, page }) => {
    await newOnline(context, page);

    const pagination = await page.getByTestId('pagination');
    await expect(
      pagination.locator('span').getByText('Page 1 of 4')
    ).toBeVisible();
  });

  test('32 results are displayed per page', async ({ context, page }) => {
    await newOnline(context, page);

    const workCards = await page.locator('[data-component="work-card"]');
    await expect(workCards).toHaveCount(32);
  });
});
