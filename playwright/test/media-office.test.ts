import { test, expect } from '@playwright/test';
import { mediaOfficeUrl } from './helpers/urls';
import { gotoWithoutCache } from './helpers/contexts';

test('(1) Media office page shows 16 most recent press releases', async ({
  page,
}) => {
  await gotoWithoutCache(mediaOfficeUrl, page);
  await expect(page.getByTestId('search-result')).toHaveCount(16);
});
