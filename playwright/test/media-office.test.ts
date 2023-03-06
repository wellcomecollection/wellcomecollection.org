import { test } from '@playwright/test';
import { mediaOfficeUrl } from './helpers/urls';
import { gotoWithoutCache } from './contexts';

test.describe('media office', () => {
  test('it shows recent press releases', async ({ page }) => {
    await gotoWithoutCache(mediaOfficeUrl, page);
    await page.getByTestId('search-result').click();
  });
});
