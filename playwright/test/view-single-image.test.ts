import { expect, test } from '@playwright/test';

import { singleImageItem } from './helpers/contexts';

test.describe('Single image viewer page', () => {
  test('should not redirect to work page on load', async ({
    context,
    page,
  }) => {
    // This tests the bug fix: https://github.com/wellcomecollection/wellcomecollection.org/pull/12730
    await singleImageItem(context, page);

    // Wait for the image viewer to be fully loaded
    await expect(page.getByRole('button', { name: 'Zoom in' })).toBeVisible();

    // Now check URL hasn't changed - should still include /images and the ID parameter
    // This verifies the redirect hasn't been delayed
    expect(page.url()).toContain('/works/v57fxbug/images?id=jueq3ffv');
  });
});
