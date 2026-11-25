import {
  createMockCanvas,
  createMockManifest,
} from '@weco/content/test/fixtures/iiif/transformed-manifest';

import {
  getCanvasesForPage,
  getCurrentCanvas,
  getThumbnailsPageForCanvas,
} from './work.helpers';

// getCurrentCanvas is the canonical way to work out which canvas is "current"
// for a given 1-based canvas query param. Canvas order is determined by the
// manifest's structure when we have a complete one (every canvas mapped to an
// index via canvasIndexById), since that isn't always the same as the order
// of canvases in the raw items array. We only trust canvasIndexById when it
// covers every canvas - a partial mapping falls back to plain array order.
describe('getCurrentCanvas', () => {
  it('returns undefined when there is no manifest', () => {
    expect(
      getCurrentCanvas({
        transformedManifest: undefined,
        canvasIndexById: {},
        canvasNumber: 1,
      })
    ).toBeUndefined();
  });

  it('returns undefined when the manifest has no canvases', () => {
    const transformedManifest = createMockManifest({ canvases: [] });

    expect(
      getCurrentCanvas({
        transformedManifest,
        canvasIndexById: {},
        canvasNumber: 1,
      })
    ).toBeUndefined();
  });

  it('falls back to array order when canvasIndexById is empty', () => {
    const canvasA = createMockCanvas({ id: 'a' });
    const canvasB = createMockCanvas({ id: 'b' });
    const transformedManifest = createMockManifest({
      canvases: [canvasA, canvasB],
    });

    expect(
      getCurrentCanvas({
        transformedManifest,
        canvasIndexById: {},
        canvasNumber: 2,
      })
    ).toBe(canvasB);
  });

  it('falls back to array order when the structure is incomplete (fewer entries than canvases)', () => {
    const canvasA = createMockCanvas({ id: 'a' });
    const canvasB = createMockCanvas({ id: 'b' });
    const transformedManifest = createMockManifest({
      canvases: [canvasA, canvasB],
    });
    // Only one of the two canvases has a structure position - incomplete, so
    // the (misleading) mapping below must be ignored entirely.
    const canvasIndexById = { b: 1 };

    expect(
      getCurrentCanvas({
        transformedManifest,
        canvasIndexById,
        canvasNumber: 1,
      })
    ).toBe(canvasA);
  });

  it('uses structure order over array order when the structure is complete', () => {
    const canvasA = createMockCanvas({ id: 'a' });
    const canvasB = createMockCanvas({ id: 'b' });
    // Array order is [a, b], but the structure displays b before a.
    const transformedManifest = createMockManifest({
      canvases: [canvasA, canvasB],
    });
    const canvasIndexById = { b: 1, a: 2 };

    expect(
      getCurrentCanvas({
        transformedManifest,
        canvasIndexById,
        canvasNumber: 1,
      })
    ).toBe(canvasB);
    expect(
      getCurrentCanvas({
        transformedManifest,
        canvasIndexById,
        canvasNumber: 2,
      })
    ).toBe(canvasA);
  });

  it('falls back to array order when a complete structure has no entry for the requested canvas number', () => {
    const canvasA = createMockCanvas({ id: 'a' });
    const canvasB = createMockCanvas({ id: 'b' });
    const transformedManifest = createMockManifest({
      canvases: [canvasA, canvasB],
    });
    // "Complete" (same count as canvases), but its index values (5, 7) don't
    // include 1 - and 1 is still in-bounds for the array, so a correct
    // fallback must return canvasA specifically, not just undefined either way.
    const canvasIndexById = { a: 5, b: 7 };

    expect(
      getCurrentCanvas({
        transformedManifest,
        canvasIndexById,
        canvasNumber: 1,
      })
    ).toBe(canvasA);
  });

  it('returns undefined for canvas=0 (invalid 1-indexed value)', () => {
    const transformedManifest = createMockManifest({
      canvases: [createMockCanvas({ id: 'a' }), createMockCanvas({ id: 'b' })],
    });

    expect(
      getCurrentCanvas({
        transformedManifest,
        canvasIndexById: {},
        canvasNumber: 0,
      })
    ).toBeUndefined();
  });

  it('returns undefined for a canvas number beyond the array bounds', () => {
    const transformedManifest = createMockManifest({
      canvases: [createMockCanvas({ id: 'a' }), createMockCanvas({ id: 'b' })],
    });

    expect(
      getCurrentCanvas({
        transformedManifest,
        canvasIndexById: {},
        canvasNumber: 9999,
      })
    ).toBeUndefined();
  });
});

describe('getCanvasesForPage', () => {
  const canvases = [
    createMockCanvas({ id: '0' }),
    createMockCanvas({ id: '1' }),
    createMockCanvas({ id: '2' }),
    createMockCanvas({ id: '3' }),
    createMockCanvas({ id: '4' }),
    createMockCanvas({ id: '5' }),
    createMockCanvas({ id: '6' }),
  ];

  it('returns the first page of canvases', () => {
    expect(getCanvasesForPage({ canvases, page: 1, pageSize: 3 })).toEqual([
      canvases[0],
      canvases[1],
      canvases[2],
    ]);
  });

  it('returns the requested page, offset by pageSize', () => {
    expect(getCanvasesForPage({ canvases, page: 2, pageSize: 3 })).toEqual([
      canvases[3],
      canvases[4],
      canvases[5],
    ]);
  });

  it('returns a partial page when fewer canvases remain than pageSize', () => {
    // 7 canvases, pageSize 3: page 3 only has canvases[6] left.
    expect(getCanvasesForPage({ canvases, page: 3, pageSize: 3 })).toEqual([
      canvases[6],
    ]);
  });

  it('returns an empty array for a page beyond the last canvas', () => {
    expect(getCanvasesForPage({ canvases, page: 4, pageSize: 3 })).toEqual([]);
  });

  it('returns an empty array when there are no canvases', () => {
    expect(
      getCanvasesForPage({ canvases: undefined, page: 1, pageSize: 3 })
    ).toEqual([]);
  });

  it('defaults to thumbnailsPageSize when pageSize is omitted', () => {
    expect(getCanvasesForPage({ canvases, page: 2 })).toEqual([canvases[6]]);
  });
});

describe('getThumbnailsPageForCanvas', () => {
  it('returns the first page for canvas numbers within the first page size', () => {
    expect(getThumbnailsPageForCanvas({ canvasNumber: 1, pageSize: 6 })).toBe(
      1
    );
    expect(getThumbnailsPageForCanvas({ canvasNumber: 6, pageSize: 6 })).toBe(
      1
    );
  });

  it('returns the next page once the canvas number crosses a page boundary', () => {
    expect(getThumbnailsPageForCanvas({ canvasNumber: 7, pageSize: 6 })).toBe(
      2
    );
  });

  it('uses the given pageSize rather than a hardcoded one', () => {
    expect(getThumbnailsPageForCanvas({ canvasNumber: 5, pageSize: 4 })).toBe(
      2
    );
  });

  it('defaults to thumbnailsPageSize when pageSize is omitted', () => {
    expect(getThumbnailsPageForCanvas({ canvasNumber: 7 })).toBe(2);
  });
});
