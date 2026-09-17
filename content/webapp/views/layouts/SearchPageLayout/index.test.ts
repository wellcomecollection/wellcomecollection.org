import { pageDescriptions } from '@weco/common/data/microcopy';

import { getPageLayoutMetadata } from '.';

// This used to live inside a useEffect, so the server-rendered HTML (and
// anything reading it without running JS, e.g. link unfurlers) always got
// the overview title/description regardless of the actual search category.
// Computing it directly, as tested here, means it's correct on first render.
describe('getPageLayoutMetadata', () => {
  it('returns the overview metadata by default', () => {
    const metadata = getPageLayoutMetadata('overview', undefined, []);
    expect(metadata.title).toBe('Search');
    expect(metadata.description).toBe(pageDescriptions.search.overview);
  });

  it('returns category-specific metadata, prefixed with the query string', () => {
    const metadata = getPageLayoutMetadata('works', 'mummy', []);
    expect(metadata.title).toBe('mummy | Catalogue search');
    expect(metadata.description).toBe(pageDescriptions.search.works);
    expect(metadata.url.pathname).toBe('/search/works');
  });

  it('falls back to the overview metadata for an unrecognised category', () => {
    const metadata = getPageLayoutMetadata(
      'not-a-real-category',
      undefined,
      []
    );
    expect(metadata.title).toBe('Search');
    expect(metadata.description).toBe(pageDescriptions.search.overview);
  });
});
