import { event } from './contexts';
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

describe('events', () => {
  test('single event pages include the scheduled events', async () => {
    await event('XagmOxAAACIAo0v8');
    await page.waitForSelector('h2 >> text="Events"');
    await page.waitForSelector('h3 >> text="Saturday 30 November 2019"');
    await page.waitForSelector('h5 >> text="Heart n Soul Radio"');
  });
});
