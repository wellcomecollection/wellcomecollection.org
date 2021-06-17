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
    const [, content] = await Promise.all([
      page.goto(homepageUrl),
      page.textContent('h1'),
    ]);

    expect(content).toBe(
      'A free museum and library exploring health and human experience'
    );
  });

  test('the visit us page renders with a status code of 200', async () => {
    const [, content] = await Promise.all([
      page.goto(visitUsUrl),
      page.textContent('h1'),
    ]);

    expect(content).toBe('Visit us');
  });

  test(`the what's on page renders with a status code of 200`, async () => {
    const [, content] = await Promise.all([
      page.goto(whatsOnUrl),
      page.textContent('h1'),
    ]);

    expect(content).toBe("What's on");
  });

  test(`the stories page renders with a status code of 200`, async () => {
    const [, content] = await Promise.all([
      page.goto(storiesUrl),
      page.textContent('h1'),
    ]);

    expect(content).toBe('Stories');
  });

  test('the collections page renders with a status code of 200', async () => {
    const [, content] = await Promise.all([
      page.goto(collectionsUrl),
      page.textContent('h1'),
    ]);

    expect(content).toBe('Collections');
  });

  test('the about us page renders with a status code of 200', async () => {
    const [, content] = await Promise.all([
      page.goto(aboutUsUrl),
      page.textContent('h1'),
    ]);

    expect(content).toBe('About us');
  });
});
