import linkResolver from '../link-resolver';

/**
 * articles and webcomics look and act the same, but we're unable
 * to change the types of documents in Prismic.
 * {@link} https://community.prismic.io/t/import-export-change-type-of-imported-document/7814
 */
describe('webcomic edge case', () => {
  test.each([
    { doc: { type: 'webcomics', id: '1' }, path: '/articles/1' },
    { doc: { type: 'webcomic-series', id: '1' }, path: '/series/1' },
  ])('$doc resolves to $path', ({ doc, path }) => {
    expect(linkResolver(doc)).toBe(path);
  });
});

test.each([
  { doc: { type: 'articles', id: '1' }, path: '/articles/1' },
  { doc: { type: 'pages', id: '1' }, path: '/pages/1' },
  { doc: { type: 'not a thing', id: '1' }, path: null },
])('$doc resolves to $path', ({ doc, path }) => {
  expect(linkResolver(doc)).toBe(path);
});

export {};
