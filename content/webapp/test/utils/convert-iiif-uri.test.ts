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

  it('finds the info.json for an unrecognised URI', () => {
    const result = convertRequestUriToInfoUri(
      'https://iiif.wellcomecollection.org/image/b0007.jp2'
    );
    expect(result).toEqual(
      'https://iiif.wellcomecollection.org/image/b0007.jp2/info.json'
    );
  });
});
