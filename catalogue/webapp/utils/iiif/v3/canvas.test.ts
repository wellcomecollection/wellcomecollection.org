import { getThumbnailImage } from './canvas';
import b21506115 from '@weco/catalogue/test/fixtures/iiif/manifests/b21506115';
import b2178081x from '@weco/catalogue/test/fixtures/iiif/manifests/b2178081x';

describe('getThumbnailImage', () => {
  it('if there’s no thumbnail on the canvas', () => {
    const canvas = {};
    expect(getThumbnailImage(canvas as any)).toBeUndefined();
  });

  it('finds a thumbnail image from a digitised book', () => {
    // This test looks for thumbnails in manifests that are pre- and post-
    // the DLCS image server upgrades in summer 2023.
    const canvas1 = b21506115.items[0];
    expect(getThumbnailImage(canvas1 as any)).toStrictEqual({
      url: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0001.jp2/full/286%2C/0/default.jpg',
      width: 286,
    });

    const canvas2 = b2178081x.items[0];
    expect(getThumbnailImage(canvas2 as any)).toStrictEqual({
      url: 'https://iiif-test.wellcomecollection.org/thumbs/b2178081x_0002_0005.jp2/full/299%2C/0/default.jpg',
      width: 299,
    });
  });
});
