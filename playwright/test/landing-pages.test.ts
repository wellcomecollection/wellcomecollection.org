import {
  homepageUrl,
  visitUsUrl,
  whatsOnUrl,
  storiesUrl,
  collectionsUrl,
  aboutUsUrl,
} from './helpers/urls';

describe('Top-level landing pages', () => {
  test('the homepage renders with a status code of 200', async () => {
    const [, response] = await Promise.all([
      page.goto(homepageUrl),
      page.waitForEvent('response'),
    ]);

    expect(response.ok()).toBe(true);
  });

  test('the visit us page renders with a status code of 200', async () => {
    const [, response] = await Promise.all([
      page.goto(visitUsUrl),
      page.waitForEvent('response'),
    ]);

    expect(response.ok()).toBe(true);
  });

  test(`the what's on page renders with a status code of 200`, async () => {
    const [, response] = await Promise.all([
      page.goto(whatsOnUrl),
      page.waitForEvent('response'),
    ]);

    expect(response.ok()).toBe(true);
  });

  test(`the stories page renders with a status code of 200`, async () => {
    const [, response] = await Promise.all([
      page.goto(storiesUrl),
      page.waitForEvent('response'),
    ]);

    expect(response.ok()).toBe(true);
  });

  test('the collections page renders with a status code of 200', async () => {
    const [, response] = await Promise.all([
      page.goto(collectionsUrl),
      page.waitForEvent('response'),
    ]);

    expect(response.ok()).toBe(true);
  });

  test('the about us page renders with a status code of 200', async () => {
    const [, response] = await Promise.all([
      page.goto(aboutUsUrl),
      page.waitForEvent('response'),
    ]);

    expect(response.ok()).toBe(true);
  });
});
