import { expect, test } from './helpers/analytics-blocking';
import { whatsOn } from './helpers/contexts';

test.describe('(1) | EventsByMonth with JavaScript disabled', () => {
  test.use({ javaScriptEnabled: false }); // Turn off JS for tests in this block

  test('the /whats-on page displays all events', async ({ context, page }) => {
    await whatsOn(context, page);
    const links = await page
      .getByRole('link', { name: 'View all events' })
      .all();
    const linksCount = links.length;

    for (let linkIndex = 0; linkIndex < linksCount; linkIndex++) {
      const link = links[linkIndex];
      await expect(link).toBeVisible();
    }
  });
});

test.describe('(2) | EventsByMonth with JavaScript enabled', () => {
  test('the /whats-on on page displays events by months in switchable tabs, only current/active month being visible', async ({
    context,
    page,
  }) => {
    await whatsOn(context, page);
    const links = await page
      .getByRole('link', { name: 'View all events' })
      .all();
    const linksCount = links.length;

    for (let linkIndex = 0; linkIndex < linksCount; linkIndex++) {
      const link = links[linkIndex];
      if (linkIndex === 0) {
        await expect(link).toBeVisible();
      } else {
        await expect(link).toBeHidden();
      }
    }
  });
});
