import { expect, test } from '@playwright/test';

import { apiToolbarPage } from './helpers/contexts';

test('(1) | Does not create a tzitzit link for images in copyright', async ({
  page,
  context,
}) => {
  await apiToolbarPage('works/fedcvz22/items', context, page);

  await expect(
    page.getByText(
      'This image is labelled as in copyright. Check before using.',
      { exact: true }
    )
  ).toBeVisible();
});

test('(2) | Creates a tzitzit link for item pages', async ({
  page,
  context,
}) => {
  await apiToolbarPage('works/ccg335hm/items', context, page);

  const anchor = await page.getByRole('link', { name: 'tzitzit' });
  await expect(anchor).toBeVisible();

  const url = await anchor.getAttribute('href');

  expect(url).toBe(
    'https://s3-eu-west-1.amazonaws.com/tzitzit.wellcomecollection.org/index.html?title=Fish+schizophrene.&sourceName=Wellcome+Collection&sourceLink=https%3A%2F%2Fwellcomecollection.org%2Fworks%2Fccg335hm%2Fitems&author=Charnley%2C+Bryan%2C+1949-1991'
  );
});

test('(3) | Creates a tzitzit link for image pages', async ({
  page,
  context,
}) => {
  await apiToolbarPage('works/ccg335hm/images?id=srfsqn7t', context, page);

  const anchor = await page.getByRole('link', { name: 'tzitzit' });
  await expect(anchor).toBeVisible();

  const url = await anchor.getAttribute('href');

  expect(url).toBe(
    'https://s3-eu-west-1.amazonaws.com/tzitzit.wellcomecollection.org/index.html?title=Fish+schizophrene.&sourceName=Wellcome+Collection&sourceLink=https%3A%2F%2Fwellcomecollection.org%2Fworks%2Fccg335hm%2Fimages%3Fid%3Dsrfsqn7t&licence=CC-BY-NC&author=Charnley%2C+Bryan%2C+1949-1991'
  );
});
