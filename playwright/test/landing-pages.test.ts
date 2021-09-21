import {
  homepageUrl,
  visitUsUrl,
  whatsOnUrl,
  storiesUrl,
  collectionsUrl,
  aboutUsUrl,
  worksUrl,
  imagesUrl,
} from './helpers/urls';
import { gotoWithoutCache } from './contexts';

describe('Top-level landing pages', () => {
  test('the homepage renders with an accessible title', async () => {
    const [, content] = await Promise.all([
      gotoWithoutCache(homepageUrl),
      page.textContent('h1'),
    ]);

    expect(content).toBe(
      'A free museum and library exploring health and human experience'
    );
  });

  test('the visit us page renders with an accessible title', async () => {
    const [, content] = await Promise.all([
      gotoWithoutCache(visitUsUrl),
      page.textContent('h1'),
    ]);

    expect(content).toBe('Visit us');
  });

  test(`the what's on page renders with an accessible title`, async () => {
    const [, content] = await Promise.all([
      gotoWithoutCache(whatsOnUrl),
      page.textContent('h1'),
    ]);

    expect(content).toBe("What's on");
  });

  test(`the stories page renders with an accessible title`, async () => {
    const [, content] = await Promise.all([
      gotoWithoutCache(storiesUrl),
      page.textContent('h1'),
    ]);

    expect(content).toBe('Stories');
  });

  test('the collections page renders with an accessible title', async () => {
    const [, content] = await Promise.all([
      gotoWithoutCache(collectionsUrl),
      page.textContent('h1'),
    ]);

    expect(content).toBe('Collections');
  });

  test('the about us page renders with an accessible title', async () => {
    const [, content] = await Promise.all([
      gotoWithoutCache(aboutUsUrl),
      page.textContent('h1'),
    ]);

    expect(content).toBe('About us');
  });

  test('the works page renders with an accessible title', async () => {
    const [, content] = await Promise.all([
      gotoWithoutCache(worksUrl),
      page.textContent('h1'),
    ]);

    expect(content).toBe('Search the collections');
  });

  test('the images page renders with an accessible title', async () => {
    const [, content] = await Promise.all([
      gotoWithoutCache(imagesUrl),
      page.textContent('h1'),
    ]);

    expect(content).toBe('Search the collections');
  });
});
