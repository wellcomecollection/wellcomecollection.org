import { article } from './contexts';
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

describe('articles', () => {
  test('contributors are shown on articles', async () => {
    await article('Ya4jyRAAAGNLAejB');
    await page.waitForSelector('h3 >> text="Yiling Zhang"');
  });

  test('related stories are shown on articles', async () => {
    // We're deliberately testing multiple stories here, to catch an issue where
    // the "related stories" section can show related stories for the wrong series.
    //
    // Note: at time of writing, the related stories were looked up using an /api/articles
    // endpoint which was being incorrectly cached in CloudFront.  This test may start
    // failing even if the application code hasn't changed.
    //
    // See https://github.com/wellcomecollection/wellcomecollection.org/issues/7461

    await article('YUrz5RAAACIA4ZrH');
    await page.waitForSelector(
      'div >> text="Conflicted and confused about lithium"'
    );

    await article('YPAnpxAAACIAbz2c');
    await page.waitForSelector('div >> text="This is a MOOD"');
  });
});
