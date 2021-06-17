import {
  homepageUrl,
  visitUsUrl,
  whatsOnUrl,
  storiesUrl,
  collectionsUrl,
  aboutUsUrl,
} from './helpers/urls';

describe('Top-level landing pages', () => {
  test.skip('the homepage renders with a status code of 200', async () => {
    await page.goto(homepageUrl);
    const response = await page.waitForEvent('response');
    expect(response.ok()).toBe(true);
  });

  test.skip('the visit us page renders with a status code of 200', async () => {
    await page.goto(visitUsUrl);
    const response = await page.waitForEvent('response');
    expect(response.ok()).toBe(true);
  });

  test.skip(`the what's on page renders with a status code of 200`, async () => {
    await page.goto(whatsOnUrl);
    const response = await page.waitForEvent('response');
    expect(response.ok()).toBe(true);
  });

  test.skip(`the stories page renders with a status code of 200`, async () => {
    await page.goto(storiesUrl);
    const response = await page.waitForEvent('response');
    expect(response.ok()).toBe(true);
  });

  test.skip('the collections page renders with a status code of 200', async () => {
    await page.goto(collectionsUrl);
    const response = await page.waitForEvent('response');
    expect(response.ok()).toBe(true);
  });

  test.skip('the about us page renders with a status code of 200', async () => {
    await page.goto(aboutUsUrl);
    const response = await page.waitForEvent('response');
    expect(response.ok()).toBe(true);
  });
});
