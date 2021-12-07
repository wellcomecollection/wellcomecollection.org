import { imageGalleryArticle } from './contexts';
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

test('contributors are shown on articles', async () => {
  await imageGalleryArticle('Ya4jyRAAAGNLAejB');
  await page.waitForSelector('h3 >> text="Yiling Zhang"');
});
