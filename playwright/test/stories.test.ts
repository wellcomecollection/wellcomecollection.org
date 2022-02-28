import { gotoWithoutCache } from './contexts';
import { baseUrl } from './helpers/urls';
import { makeDefaultToggleAndTestCookies } from './helpers/utils';

const domain = new URL(baseUrl).host;

beforeAll(async () => {
  const defaultToggleAndTestCookies = await makeDefaultToggleAndTestCookies(
    domain
  );
  await context.addCookies([
    { name: 'WC_cookiesAccepted', value: 'true', domain: domain, path: '/' },
    ...defaultToggleAndTestCookies,
  ]);
});

describe('stories', () => {
  test('cards for the featured series are shown on /stories', async () => {
    await gotoWithoutCache(`${baseUrl}/stories`);

    const heading = await page.waitForSelector(`a[href ^= "/series"]`);
    const featuredSeriesTitle = await heading.textContent();

    await page.waitForSelector(`p >> text="Part of ${featuredSeriesTitle}"`);
  });
});
