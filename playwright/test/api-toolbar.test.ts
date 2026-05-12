import { expect, test } from '@playwright/test';

import { apiToolbarPage } from './helpers/contexts';
import { urlWithParams } from './helpers/utils';

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
    urlWithParams(
      'https://s3-eu-west-1.amazonaws.com/tzitzit.wellcomecollection.org/index.html',
      {
        title: 'Fish schizophrene.',
        sourceName: 'Wellcome Collection',
        sourceLink: 'https://wellcomecollection.org/works/ccg335hm/items',
        author: 'Bryan Charnley',
      }
    )
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
    urlWithParams(
      'https://s3-eu-west-1.amazonaws.com/tzitzit.wellcomecollection.org/index.html',
      {
        title: 'Fish schizophrene.',
        sourceName: 'Wellcome Collection',
        sourceLink:
          'https://wellcomecollection.org/works/ccg335hm/images?id=srfsqn7t',
        licence: 'CC-BY-NC',
        author: 'Bryan Charnley',
      }
    )
  );
});
