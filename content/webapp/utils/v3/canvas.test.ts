import { Canvas } from '@iiif/presentation-3';
import { getThumbnailImage } from './canvas';
import {
  b21506115,
  b2178081x,
  b28462270,
} from '@weco/catalogue/test/fixtures/iiif/manifests';

describe('getThumbnailImage', () => {
  it('if there’s no thumbnail on the canvas', () => {
    const canvas: Canvas = {
      id: 'example',
      type: 'Canvas',
    };
    expect(getThumbnailImage(canvas)).toBeUndefined();
  });

  it('finds a thumbnail image from a digitised book', () => {
    // This test looks for thumbnails in manifests that are pre- and post-
    // the DLCS image server upgrades in summer 2023.
    const canvas1 = b21506115.items[0];
    expect(getThumbnailImage(canvas1)).toStrictEqual({
      url: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0001.jp2/full/286%2C/0/default.jpg',
      width: 286,
    });

    const canvas2 = b2178081x.items[0];
    expect(getThumbnailImage(canvas2 as any)).toStrictEqual({
      url: 'https://iiif-test.wellcomecollection.org/thumbs/b2178081x_0002_0005.jp2/full/299%2C/0/default.jpg',
      width: 299,
    });
  });

  it('finds a thumbnail image for a digitised PDF', () => {
    // This is a PDF created with the new DLCS, which doesn't have an
    // image service on PDF thumbnails.
    // See https://github.com/wellcomecollection/wellcomecollection.org/issues/9727
    const canvas = b28462270.items[0];
    expect(getThumbnailImage(canvas as any)).toStrictEqual({
      url: 'https://iiif-test.wellcomecollection.org/extensions/born-digital/placeholder-thumb/fmt/20/application/pdf',
      width: 101,
    });
  });
});
