import { Canvas } from '@iiif/presentation-3';

import {
  b21506115,
  b2178081x,
  b28462270,
} from '@weco/content/test/fixtures/iiif/manifests';
import { TransformedCanvas } from '@weco/content/types/manifest';

import { getDisplayItems, getOriginal, getThumbnailImage } from './canvas';

function createCanvas(
  overrides: Partial<TransformedCanvas> = {}
): TransformedCanvas {
  return {
    id: 'https://example.com/canvas/1',
    type: 'Canvas',
    width: 100,
    height: 100,
    imageServiceId: 'https://example.com/image/1',
    label: 'Page 1',
    textServiceId: undefined,
    thumbnailImage: undefined,
    painting: [],
    original: [],
    rendering: [],
    supplementing: [],
    metadata: [],
    ...overrides,
  };
}

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
    const canvas1 = b21506115.items[0] as Canvas;
    expect(getThumbnailImage(canvas1)).toStrictEqual({
      url: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0001.jp2/full/286%2C/0/default.jpg',
      width: 286,
    });

    const canvas2 = b2178081x.items[0];
    expect(getThumbnailImage(canvas2 as unknown as Canvas)).toStrictEqual({
      url: 'https://iiif-test.wellcomecollection.org/thumbs/b2178081x_0002_0005.jp2/full/299%2C/0/default.jpg',
      width: 299,
    });
  });

  it('finds a thumbnail image for a digitised PDF', () => {
    // This is a PDF created with the new DLCS, which doesn't have an
    // image service on PDF thumbnails.
    // See https://github.com/wellcomecollection/wellcomecollection.org/issues/9727
    const canvas = b28462270.items[0];
    expect(getThumbnailImage(canvas as unknown as Canvas)).toStrictEqual({
      url: 'https://iiif-test.wellcomecollection.org/extensions/born-digital/placeholder-thumb/fmt/20/application/pdf',
      width: 101,
    });
  });
});

describe('getOriginal', () => {
  it('returns only renderings with an "original" behavior', () => {
    const rendering = [
      { id: 'original', behavior: 'original', type: 'Image' },
      { id: 'other', behavior: 'something-else', type: 'Image' },
      { id: 'no-behavior', type: 'Image' },
    ];
    expect(getOriginal(rendering as never).map(o => o.id)).toEqual([
      'original',
    ]);
  });

  it('returns an empty array when there are no originals', () => {
    const rendering = [
      { id: 'other', behavior: 'something-else', type: 'Image' },
      { id: 'no-behavior', type: 'Image' },
    ];

    expect(getOriginal(rendering as never)).toEqual([]);
    expect(getOriginal([])).toEqual([]);
    expect(getOriginal(undefined)).toEqual([]);
  });
});

describe('getDisplayItems', () => {
  it('prefers original PDFs when present', () => {
    const canvas = createCanvas({
      original: [
        { id: 'pdf', format: 'application/pdf', behavior: 'original' },
      ] as never,
      painting: [{ id: 'painting', type: 'Image' }] as never,
    });
    expect(getDisplayItems(canvas).map(i => 'id' in i && i.id)).toEqual([
      'pdf',
    ]);
  });

  it('falls back to painting when there is no original PDF', () => {
    const canvas = createCanvas({
      original: [],
      painting: [{ id: 'painting', type: 'Image' }] as never,
      supplementing: [{ id: 'supplementing', type: 'Text' }] as never,
    });
    expect(getDisplayItems(canvas).map(i => 'id' in i && i.id)).toEqual([
      'painting',
    ]);
  });

  it('falls back to supplementing when there is no original or painting', () => {
    const canvas = createCanvas({
      original: [],
      painting: [],
      supplementing: [{ id: 'supplementing', type: 'Text' }] as never,
    });
    expect(getDisplayItems(canvas).map(i => 'id' in i && i.id)).toEqual([
      'supplementing',
    ]);
  });
});
