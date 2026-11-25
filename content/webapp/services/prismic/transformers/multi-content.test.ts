import { parseQuery } from './multi-content';

test('search for single tags and single ids', () => {
  const structuredQuery = parseQuery('id:123 tag:things');

  expect(structuredQuery.tag.length).toBe(1);
  expect(structuredQuery.id.length).toBe(1);
});

test('search for multiple tags and multiple ids', () => {
  const idCount = Math.floor(Math.random() * 5) + 1;
  const tagCount = Math.floor(Math.random() * 5) + 1;

  const ids = new Array(idCount).fill(undefined).map((_, i) => `id:${i}`);
  const tags = new Array(tagCount).fill(undefined).map((_, i) => `tag:${i}`);
  const query = ids.concat(tags).join(' ');
  const structuredQuery = parseQuery(query);

  expect(structuredQuery.tag.length).toBe(tagCount);
  expect(structuredQuery.id.length).toBe(idCount);
});

test('caps pageSize', () => {
  expect(parseQuery('tag:test pageSize:1000').pageSize).toBe(100);
});

test('keeps allowed orderings', () => {
  const structuredQuery = parseQuery(
    'tag:press orderings:"my.pages.datePublished desc" orderings:my.pages.datePublished'
  );

  expect(structuredQuery.orderings).toEqual([
    'my.pages.datePublished desc',
    'my.pages.datePublished',
  ]);
});

test('drops orderings that are not allowed', () => {
  const structuredQuery = parseQuery(
    'tag:test orderings:[document.id] orderings:"my.pages.x; drop" orderings:desc'
  );

  expect(structuredQuery.orderings).toEqual([]);
});

test('reads pageSize as a number', () => {
  expect(parseQuery('tag:test pageSize:16').pageSize).toBe(16);
});
