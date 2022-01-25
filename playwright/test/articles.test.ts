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
    // The exact choice of titles isn't so important; if we change the way articles are
    // fetched from Prismic (e.g. the ordering), we may get different results here.
    // The important thing is that the related stories are part of the same serial.
    //
    // If this test starts failing because the set of related stories are different,
    // but they're still part of the same serial, and you know you've changed the way
    // articles are fetched, it's okay to change the titles.
    // (e.g. https://github.com/wellcomecollection/wellcomecollection.org/pull/7574)
    //
    // Note: at time of writing, the related stories were looked up using an /api/articles
    // endpoint which was being incorrectly cached in CloudFront.  This test may start
    // failing even if the application code hasn't changed.
    //
    // See https://github.com/wellcomecollection/wellcomecollection.org/issues/7461

    await article('YUrz5RAAACIA4ZrH');
    await page.waitForSelector(
      'div >> text="Diagnosed bipolar, prescribed lithium"'
    );

    await article('YPAnpxAAACIAbz2c');
    await page.waitForSelector('div >> text="Happiness in time"');
  });
});
