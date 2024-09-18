import { expect, test } from '@playwright/test';

import { mediaOffice } from './helpers/contexts';

test('(1) Media office page shows 16 most recent press releases', async ({
  context,
  page,
}) => {
  await mediaOffice(context, page);
  await expect(page.getByTestId('search-result')).toHaveCount(16);
});
