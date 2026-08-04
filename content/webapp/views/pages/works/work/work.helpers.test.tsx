import {
  createMockCanvas,
  createMockManifest,
} from '@weco/content/test/fixtures/iiif/transformed-manifest';

import { getCurrentCanvas } from './work.helpers';

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
    // "Complete" (same count as canvases), but its index values (5, 7) don't
    // include 1 - and 1 is still in-bounds for the array, so a correct
    // fallback must return canvasA specifically, not just undefined either way.
    const canvasIndexById = { a: 5, b: 7 };

    expect(
      getCurrentCanvas({ transformedManifest, canvasIndexById, canvas: 1 })
    ).toBe(canvasA);
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
