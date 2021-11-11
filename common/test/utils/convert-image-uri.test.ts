import { convertImageUri } from '../../utils/convert-image-uri';

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
