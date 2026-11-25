import {
  convertIiifImageUri,
  convertImageUri,
} from '@weco/common/utils/convert-image-uri';

describe('convertImageUri for Prismic images', () => {
  it('creates a full-sized image', () => {
    const result = convertImageUri(
      'https://images.prismic.io/wellcomecollection/EP_0001.jpg',
      'full'
    );

    expect(result).toEqual(
      'https://images.prismic.io/wellcomecollection/EP_0001.jpg?auto=&rect=&w=full&h='
    );
  });

  it('replaces an existing width parameter with a number', () => {
    const result = convertImageUri(
      'https://images.prismic.io/wellcomecollection/EP_0002.jpg?w=100',
      200
    );

    expect(result).toEqual(
      'https://images.prismic.io/wellcomecollection/EP_0002.jpg?auto=&rect=&w=200&h='
    );
  });

  it('updates an existing height parameter based on the width', () => {
    const result = convertImageUri(
      'https://images.prismic.io/wellcomecollection/EP_0003.jpg?w=100&h=200',
      300
    );

    expect(result).toEqual(
      'https://images.prismic.io/wellcomecollection/EP_0003.jpg?auto=&rect=&w=300&h=600'
    );
  });

  it('removes unrecognised parameters', () => {
    const fullResult = convertImageUri(
      'https://images.prismic.io/wellcomecollection/EP_0004.jpg?token=sekrit',
      'full'
    );
    expect(fullResult).toEqual(
      'https://images.prismic.io/wellcomecollection/EP_0004.jpg?auto=&rect=&w=full&h='
    );

    const wideResult = convertImageUri(
      'https://images.prismic.io/wellcomecollection/EP_0004.jpg?token=sekrit',
      300
    );
    expect(wideResult).toEqual(
      'https://images.prismic.io/wellcomecollection/EP_0004.jpg?auto=&rect=&w=300&h='
    );
  });
});

describe('convertImageUri for IIIF images', () => {
  it('passes through GIFs unmodified', () => {
    const result = convertImageUri(
      'https://iiif.wellcomecollection.org/image/b0001.gif',
      'full'
    );
    expect(result).toEqual(
      'https://iiif.wellcomecollection.org/image/b0001.gif'
    );
  });

  it('sets the size parameter on a URI to full', () => {
    const result = convertImageUri(
      'https://iiif.wellcomecollection.org/image/b0002.jpg',
      'full'
    );
    expect(result).toEqual(
      'https://iiif.wellcomecollection.org/image/b0002.jpg/full/full/0/default.jpg'
    );
  });

  it('sets the size parameter on a URI to a number', () => {
    const result = convertImageUri(
      'https://iiif.wellcomecollection.org/image/b0003.jpg',
      300
    );
    expect(result).toEqual(
      'https://iiif.wellcomecollection.org/image/b0003.jpg/full/300%2C/0/default.jpg'
    );
  });

  it('returns a URI for a PNG image', () => {
    const result = convertImageUri(
      'https://iiif.wellcomecollection.org/image/b0004.png',
      300
    );
    expect(result).toEqual(
      'https://iiif.wellcomecollection.org/image/b0004.png/full/300%2C/0/default.png'
    );
  });

  it('defaults to a URI for a JPEG image', () => {
    const result = convertImageUri(
      'https://iiif.wellcomecollection.org/image/b0005',
      300
    );
    expect(result).toEqual(
      'https://iiif.wellcomecollection.org/image/b0005/full/300%2C/0/default.jpg'
    );
  });

  it('also transforms thumbnails', () => {
    const result = convertIiifImageUri(
      'https://iiif.wellcomecollection.org/thumbs/b30598977_0001.jp2/full/!200,200/0/default.jpg',
      300
    );
    expect(result).toEqual(
      'https://iiif.wellcomecollection.org/thumbs/b30598977_0001.jp2/full/!300,300/0/default.jpg'
    );
  });

  it('preserves rotation when resizing', () => {
    const result = convertIiifImageUri(
      'https://iiif.wellcomecollection.org/image/b29338062_0001.jp2/full/640,/90/default.jpg',
      800
    );
    expect(result).toEqual(
      'https://iiif.wellcomecollection.org/image/b29338062_0001.jp2/full/800%2C/90/default.jpg'
    );
  });

  it('handles rotation of 0 by including it', () => {
    const result = convertIiifImageUri(
      'https://iiif.wellcomecollection.org/image/b29338062_0001.jp2/full/640,/0/default.jpg',
      800
    );
    expect(result).toEqual(
      'https://iiif.wellcomecollection.org/image/b29338062_0001.jp2/full/800%2C/0/default.jpg'
    );
  });

  it('uses default rotation when URL has incomplete path segments', () => {
    // URL missing rotation and quality.format parts
    const result = convertIiifImageUri(
      'https://iiif.wellcomecollection.org/image/b29338062_0001.jp2/full/640,',
      800
    );
    // Should not break, should use default rotation of 0
    expect(result).toEqual(
      'https://iiif.wellcomecollection.org/image/b29338062_0001.jp2/full/800%2C/0/default.jpg'
    );
  });

  it('preserves rotation through multiple conversions', () => {
    const result1 = convertIiifImageUri(
      'https://iiif.wellcomecollection.org/image/b29338062_0001.jp2/full/640,/90/default.jpg',
      800
    );
    const result2 = convertIiifImageUri(result1, 1000);
    expect(result2).toEqual(
      'https://iiif.wellcomecollection.org/image/b29338062_0001.jp2/full/1000%2C/90/default.jpg'
    );
  });
});
