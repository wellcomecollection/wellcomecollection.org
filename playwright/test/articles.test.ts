import { article, articleWithMockSiblings } from './contexts';
import { baseUrl } from './helpers/urls';
import { makeDefaultToggleAndTestCookies } from './helpers/utils';
import { oneScheduleItem } from './mocks/one-schedule-item';

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

    await article('YPAnpxAAACIAbz2c');
    await page.waitForSelector('a >> text="Happiness in time"');
  });

  test('an article in a serial with further parts in a schedule will link to the next part', async () => {
    await article('YRzdyREAACEAqIu-');
    await page.waitForSelector(
      'a >> text="Finding out where my lithium comes from"'
    );
  });

  test('the last article in a serial will link to the first part', async () => {
    await article('YUrz5RAAACIA4ZrH');
    await page.waitForSelector(
      'a >> text="Diagnosed bipolar, prescribed lithium"'
    );
  });

  test('no related story is shown for an article in a serial with only one schedule item', async () => {
    await articleWithMockSiblings('YeUumhAAAJMQMtKc', oneScheduleItem);

    expect(
      await page.isVisible(
        `a >> text="Deciding a date for the end of the world"`
      )
    ).toBeFalsy();
  });
});
