import { convertRequestUriToInfoUri } from '@weco/content/utils/iiif/convert-iiif-uri';

describe('convertRequestUriToInfoUri', () => {
  it('finds the info.json for a IIIF URI', () => {
    const result = convertRequestUriToInfoUri(
      'https://iiif.wellcomecollection.org/image/b0006.jpg/full/300%2C/0/default.jpg'
    );
    expect(result).toEqual(
      'https://iiif.wellcomecollection.org/image/b0006.jpg/info.json'
    );
  });

  it('finds the info.json for a IIIF URI with no request parameters', () => {
    const result = convertRequestUriToInfoUri(
      'https://iiif.wellcomecollection.org/image/b0007.jp2'
    );
    expect(result).toEqual(
      'https://iiif.wellcomecollection.org/image/b0007.jp2/info.json'
    );
  });

  it('returns undefined for an unrecognised URI', () => {
    const result = convertRequestUriToInfoUri(
      'https://example.com/not-a-iiif-uri'
    );
    expect(result).toBeUndefined();
  });

  it('returns undefined when given undefined', () => {
    const result = convertRequestUriToInfoUri(undefined);
    expect(result).toBeUndefined();
  });

  it('finds the info.json for a /thumbs/ URI', () => {
    const result = convertRequestUriToInfoUri(
      'https://iiif.wellcomecollection.org/thumbs/b30268412_0027.jp2/full/238,/0/default.jpg'
    );
    expect(result).toEqual(
      'https://iiif.wellcomecollection.org/thumbs/b30268412_0027.jp2/info.json'
    );
  });
});
