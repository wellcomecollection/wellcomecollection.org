import {
  convertIiifImageUri,
  convertPrismicImageUri,
} from '../../utils/convert-image-uri';

describe('convertPrismicImageUri', () => {
  it('replaces an existing width parameter with a number', () => {
    const result = convertPrismicImageUri(
      'https://images.prismic.io/wellcomecollection/EP_0002.jpg?w=100',
      200
    );

    expect(result).toEqual(
      'https://images.prismic.io/wellcomecollection/EP_0002.jpg?auto=&rect=&w=200&h='
    );
  });

  it('updates an existing height parameter based on the width', () => {
    const result = convertPrismicImageUri(
      'https://images.prismic.io/wellcomecollection/EP_0003.jpg?w=100&h=200',
      300
    );

    expect(result).toEqual(
      'https://images.prismic.io/wellcomecollection/EP_0003.jpg?auto=&rect=&w=300&h=600'
    );
  });

  it('removes unrecognised parameters', () => {
    const fullResult = convertPrismicImageUri(
      'https://images.prismic.io/wellcomecollection/EP_0004.jpg?token=sekrit',
      400
    );
    expect(fullResult).toEqual(
      'https://images.prismic.io/wellcomecollection/EP_0004.jpg?auto=&rect=&w=400&h='
    );

    const wideResult = convertPrismicImageUri(
      'https://images.prismic.io/wellcomecollection/EP_0004.jpg?token=sekrit',
      300
    );
    expect(wideResult).toEqual(
      'https://images.prismic.io/wellcomecollection/EP_0004.jpg?auto=&rect=&w=300&h='
    );
  });
});

describe('convertIiifImageUri', () => {
  it('passes through GIFs unmodified', () => {
    const result = convertIiifImageUri(
      'https://iiif.wellcomecollection.org/image/b0001.gif',
      'full'
    );
    expect(result).toEqual(
      'https://iiif.wellcomecollection.org/image/b0001.gif'
    );
  });

  it('sets the size parameter on a URI to full', () => {
    const result = convertIiifImageUri(
      'https://iiif.wellcomecollection.org/image/b0002.jpg',
      'full'
    );
    expect(result).toEqual(
      'https://iiif.wellcomecollection.org/image/b0002.jpg/full/full/0/default.jpg'
    );
  });

  it('sets the size parameter on a URI to a number', () => {
    const result = convertIiifImageUri(
      'https://iiif.wellcomecollection.org/image/b0003.jpg',
      300
    );
    expect(result).toEqual(
      'https://iiif.wellcomecollection.org/image/b0003.jpg/full/300%2C/0/default.jpg'
    );
  });

  it('returns a URI for a PNG image', () => {
    const result = convertIiifImageUri(
      'https://iiif.wellcomecollection.org/image/b0004.png',
      300
    );
    expect(result).toEqual(
      'https://iiif.wellcomecollection.org/image/b0004.png/full/300%2C/0/default.png'
    );
  });

  it('defaults to a URI for a JPEG image', () => {
    const result = convertIiifImageUri(
      'https://iiif.wellcomecollection.org/image/b0005',
      300
    );
    expect(result).toEqual(
      'https://iiif.wellcomecollection.org/image/b0005/full/300%2C/0/default.jpg'
    );
  });

  it('ignores a thumbnail', () => {
    const result = convertIiifImageUri(
      'https://iiif.wellcomecollection.org/thumbs/b30598977_0001.jp2/full/!200,200/0/default.jpg',
      'full'
    );
    expect(result).toEqual(
      'https://iiif.wellcomecollection.org/thumbs/b30598977_0001.jp2/full/!200,200/0/default.jpg'
    );
  });
});
