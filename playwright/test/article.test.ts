import { test, expect } from '@playwright/test';
import { article, articleWithMockSiblings } from './helpers/contexts';
import { oneScheduleItem } from './mocks/one-schedule-item';

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

test('(1) | Related stories are shown on articles', async ({
  page,
  context,
}) => {
  await article('YPAnpxAAACIAbz2c', context, page);
  await page.getByRole('link', { name: 'Happiness in time' });
});

test('(2) | An article in a serial with further parts in a schedule will link to the next part', async ({
  page,
  context,
}) => {
  await article('YRzdyREAACEAqIu-', context, page);
  await page.getByRole('link', {
    name: 'Finding out where my lithium comes from',
  });
});

test('(3) | The last article in a serial will link to the first part', async ({
  page,
  context,
}) => {
  await article('YUrz5RAAACIA4ZrH', context, page);
  await page.getByRole('link', {
    name: 'Diagnosed bipolar, prescribed lithium',
  });
});

test('(4) | No related story is shown for an article in a serial with only one schedule item', async ({
  page,
  context,
}) => {
  await articleWithMockSiblings(
    'YeUumhAAAJMQMtKc',
    oneScheduleItem,
    context,
    page
  );

  await expect(
    await page.getByRole('link', {
      name: 'Deciding a date for the end of the world',
    })
  ).toHaveCount(0);
});

// See https://github.com/wellcomecollection/wellcomecollection.org/issues/7641
test('(5) | Articles use the 32:15 crop for their social media preview', async ({
  page,
  context,
}) => {
  await article('Yd8L-hAAAIAWFxqa', context, page);

  const metaTag = await page.locator('meta[name="twitter:image"]');

  await expect(metaTag).toHaveAttribute(
    'content',
    'https://images.prismic.io/wellcomecollection/2a42de1c-7954-4ece-be5f-775079c4bc54_Lauren+seated+outside.jpg?auto=compress%2Cformat&rect=0%2C261%2C4000%2C1875&w=800&h=375'
  );
});
