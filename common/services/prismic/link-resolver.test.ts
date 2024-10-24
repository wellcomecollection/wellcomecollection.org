import linkResolver from './link-resolver';

/**
 * articles and webcomics look and act the same, but we're unable
 * to change the types of documents in Prismic.
 * {@link} https://community.prismic.io/t/import-export-change-type-of-imported-document/7814
 */
describe('webcomic edge case', () => {
  test.each([
    { doc: { type: 'webcomics', uid: '1' }, path: '/stories/1' },
    { doc: { type: 'webcomic-series', uid: '1' }, path: '/series/1' },
  ])('$doc resolves to $path', ({ doc, path }) => {
    expect(linkResolver(doc)).toBe(path);
  });
});

it('resolves exhibition guides to /guides/exhibitions/{id}', () => {
  const doc = { type: 'exhibition-guides', uid: '1' };
  expect(linkResolver(doc)).toBe('/guides/exhibitions/1');
});

test.each([
  { doc: { type: 'articles', uid: '1' }, path: '/stories/1' },
  { doc: { type: 'pages', uid: '1' }, path: '/pages/1' },
  { doc: { type: 'not a thing', uid: '1' }, path: '/' },
])('$doc resolves to $path', ({ doc, path }) => {
  expect(linkResolver(doc)).toBe(path);
});

export {};
