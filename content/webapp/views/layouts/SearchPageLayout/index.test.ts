import { pageDescriptions } from '@weco/common/data/microcopy';

import { getPageLayoutMetadata } from '.';

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
