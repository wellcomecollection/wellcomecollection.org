import {
  createMockCanvas,
  createMockManifest,
} from '@weco/content/test/fixtures/iiif/transformed-manifest';

import { getCanvasNavigation, getCurrentCanvas } from './work.helpers';

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
        canvas: 1,
      })
    ).toBeUndefined();
  });

  it('returns undefined when the manifest has no canvases', () => {
    const transformedManifest = createMockManifest({ canvases: [] });

    expect(
      getCurrentCanvas({ transformedManifest, canvasIndexById: {}, canvas: 1 })
    ).toBeUndefined();
  });

  it('falls back to array order when canvasIndexById is empty', () => {
    const canvasA = createMockCanvas({ id: 'a' });
    const canvasB = createMockCanvas({ id: 'b' });
    const transformedManifest = createMockManifest({
      canvases: [canvasA, canvasB],
    });

    expect(
      getCurrentCanvas({ transformedManifest, canvasIndexById: {}, canvas: 2 })
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
      getCurrentCanvas({ transformedManifest, canvasIndexById, canvas: 1 })
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
      getCurrentCanvas({ transformedManifest, canvasIndexById, canvas: 1 })
    ).toBe(canvasB);
    expect(
      getCurrentCanvas({ transformedManifest, canvasIndexById, canvas: 2 })
    ).toBe(canvasA);
  });

  it('falls back to array order when a complete structure has no entry for the requested canvas number', () => {
    const canvasA = createMockCanvas({ id: 'a' });
    const canvasB = createMockCanvas({ id: 'b' });
    const transformedManifest = createMockManifest({
      canvases: [canvasA, canvasB],
    });
    const canvasIndexById = { a: 1, b: 2 };

    expect(
      getCurrentCanvas({ transformedManifest, canvasIndexById, canvas: 9999 })
    ).toBeUndefined();
  });

  it('returns undefined for canvas=0 (invalid 1-indexed value)', () => {
    const transformedManifest = createMockManifest({
      canvases: [createMockCanvas({ id: 'a' }), createMockCanvas({ id: 'b' })],
    });

    expect(
      getCurrentCanvas({ transformedManifest, canvasIndexById: {}, canvas: 0 })
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
        canvas: 9999,
      })
    ).toBeUndefined();
  });
});

// getCanvasNavigation bundles currentCanvas with the page-position values that
// components need alongside it - the total, whether we're at either end, and
// whether prev/next are available. These characterise the behaviour
// ViewerBottomBar had when it worked them out itself.
//
// Note that none of these values are order-sensitive, unlike currentCanvas:
// totalCanvases is just a count, and the prev/next values only compare the
// 1-based canvas number against it. So a reordering structure can't change
// them, which is why there's no reordered-structure case below beyond
// confirming currentCanvas is still derived the order-aware way.
describe('getCanvasNavigation', () => {
  const threeCanvases = () =>
    createMockManifest({
      canvases: [
        createMockCanvas({ id: 'a' }),
        createMockCanvas({ id: 'b' }),
        createMockCanvas({ id: 'c' }),
      ],
    });

  describe('totalCanvases', () => {
    it('is 0 when there is no manifest', () => {
      expect(
        getCanvasNavigation({
          transformedManifest: undefined,
          canvasIndexById: {},
          canvas: 1,
        }).totalCanvases
      ).toBe(0);
    });

    it('is 0 when the manifest has no canvases', () => {
      expect(
        getCanvasNavigation({
          transformedManifest: createMockManifest({ canvases: [] }),
          canvasIndexById: {},
          canvas: 1,
        }).totalCanvases
      ).toBe(0);
    });

    it('counts the canvases when there is no structure', () => {
      expect(
        getCanvasNavigation({
          transformedManifest: threeCanvases(),
          canvasIndexById: {},
          canvas: 1,
        }).totalCanvases
      ).toBe(3);
    });

    it('counts the canvases when the structure is complete', () => {
      expect(
        getCanvasNavigation({
          transformedManifest: threeCanvases(),
          canvasIndexById: { a: 1, b: 2, c: 3 },
          canvas: 1,
        }).totalCanvases
      ).toBe(3);
    });

    // The count comes from the canvases array either way, so a structure
    // covering only some canvases can't undercount.
    it('counts the canvases when the structure is incomplete', () => {
      expect(
        getCanvasNavigation({
          transformedManifest: threeCanvases(),
          canvasIndexById: { a: 1 },
          canvas: 1,
        }).totalCanvases
      ).toBe(3);
    });
  });

  describe('page position and prev/next', () => {
    it('reports the first canvas as first, with next available but not previous', () => {
      expect(
        getCanvasNavigation({
          transformedManifest: threeCanvases(),
          canvasIndexById: {},
          canvas: 1,
        })
      ).toMatchObject({
        isFirstCanvas: true,
        isLastCanvas: false,
        canNavigatePrevious: false,
        canNavigateNext: true,
      });
    });

    it('reports a middle canvas as neither end, with both directions available', () => {
      expect(
        getCanvasNavigation({
          transformedManifest: threeCanvases(),
          canvasIndexById: {},
          canvas: 2,
        })
      ).toMatchObject({
        isFirstCanvas: false,
        isLastCanvas: false,
        canNavigatePrevious: true,
        canNavigateNext: true,
      });
    });

    it('reports the last canvas as last, with previous available but not next', () => {
      expect(
        getCanvasNavigation({
          transformedManifest: threeCanvases(),
          canvasIndexById: {},
          canvas: 3,
        })
      ).toMatchObject({
        isFirstCanvas: false,
        isLastCanvas: true,
        canNavigatePrevious: true,
        canNavigateNext: false,
      });
    });

    it('reports a single canvas as both first and last, with no navigation', () => {
      expect(
        getCanvasNavigation({
          transformedManifest: createMockManifest({
            canvases: [createMockCanvas({ id: 'a' })],
          }),
          canvasIndexById: {},
          canvas: 1,
        })
      ).toMatchObject({
        isFirstCanvas: true,
        isLastCanvas: true,
        canNavigatePrevious: false,
        canNavigateNext: false,
      });
    });

    it('offers no navigation when there are no canvases', () => {
      expect(
        getCanvasNavigation({
          transformedManifest: createMockManifest({ canvases: [] }),
          canvasIndexById: {},
          canvas: 1,
        })
      ).toMatchObject({
        canNavigatePrevious: false,
        canNavigateNext: false,
      });
    });
  });

  // Both invalid canvas numbers are reachable via the ?canvas= query param, so
  // they need to degrade sensibly rather than offer navigation off either end.
  describe('out-of-range canvas numbers', () => {
    it('offers no next canvas when the canvas number is beyond the total', () => {
      expect(
        getCanvasNavigation({
          transformedManifest: threeCanvases(),
          canvasIndexById: {},
          canvas: 9999,
        })
      ).toMatchObject({
        isFirstCanvas: false,
        isLastCanvas: true,
        canNavigatePrevious: true,
        canNavigateNext: false,
      });
    });

    it('offers no previous canvas for canvas=0 (invalid 1-indexed value)', () => {
      expect(
        getCanvasNavigation({
          transformedManifest: threeCanvases(),
          canvasIndexById: {},
          canvas: 0,
        })
      ).toMatchObject({
        isFirstCanvas: true,
        isLastCanvas: false,
        canNavigatePrevious: false,
        canNavigateNext: true,
      });
    });
  });

  describe('currentCanvas', () => {
    it('returns the canvas at the given position', () => {
      const transformedManifest = threeCanvases();

      expect(
        getCanvasNavigation({
          transformedManifest,
          canvasIndexById: {},
          canvas: 2,
        }).currentCanvas
      ).toBe(transformedManifest.canvases[1]);
    });

    // Delegates to getCurrentCanvas, so it stays order-aware - see that
    // function's own tests above for the full set of ordering cases.
    it('uses structure order over array order when the structure is complete', () => {
      const transformedManifest = threeCanvases();

      expect(
        getCanvasNavigation({
          transformedManifest,
          canvasIndexById: { c: 1, b: 2, a: 3 },
          canvas: 1,
        }).currentCanvas
      ).toBe(transformedManifest.canvases[2]);
    });
  });
});
