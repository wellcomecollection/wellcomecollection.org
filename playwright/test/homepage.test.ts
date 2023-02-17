import { expect, test } from '@playwright/test';
import { homepageUrl } from './helpers/urls';
import { gotoWithoutCache } from './contexts';

test.describe('homepage', () => {
  // See the comment in homepage.tsx about why this is important
  test('it includes the Meta domain verification tag', async ({ page }) => {
    await gotoWithoutCache(homepageUrl, page);
    const verificationTag = await page.locator(
      'meta[name="facebook-domain-verification"]'
    );
    await expect(verificationTag).toHaveAttribute(
      'content',
      'gl52uu0zshpy3yqv1ohxo3zq39mb0w'
    );
  });
});
