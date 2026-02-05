import { expect, test } from '@playwright/test';

import { singleImageItem } from './helpers/contexts';

test.describe('Single image viewer page', () => {
  test('should not redirect to work page on load', async ({
    context,
    page,
  }) => {
    // This tests the bug fix: https://github.com/wellcomecollection/wellcomecollection.org/pull/12730
    await singleImageItem(context, page);

    // Check URL hasn't changed - should still include /images and the ID parameter
    expect(page.url()).toContain('/works/v57fxbug/images?id=jueq3ffv');

    // Verify image viewer is displayed by checking for a known element, e.g. the zoom button
    await expect(page.getByRole('button', { name: 'Zoom in' })).toBeVisible();
  });
});
