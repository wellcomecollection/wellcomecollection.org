import {
  getOverlayTopLeft,
  RotationValue,
} from './VirtualizedImageViewer.SearchHighlights';

// Kept identical to its counterpart in legacy/MainViewer.test.tsx, so the two
// stay in sync - this function is duplicated between the two viewers.
describe('getOverlayTopLeft', () => {
  const imageContainerRect = { top: 10, left: 20 } as unknown as DOMRect;
  const imageRect = {
    top: 30,
    left: 50,
    width: 200,
    height: 100,
  } as unknown as DOMRect;
  const x = 15;
  const y = 8;

  // startTop = imageRect.top - imageContainerRect.top = 20
  // startLeft = imageRect.left - imageContainerRect.left = 30
  const expectedByRotation: Record<
    RotationValue,
    { overlayTop: number; overlayLeft: number }
  > = {
    0: { overlayTop: 28, overlayLeft: 45 },
    90: { overlayTop: 35, overlayLeft: 222 },
    180: { overlayTop: 112, overlayLeft: 215 },
    270: { overlayTop: 105, overlayLeft: 38 },
  };

  it.each([0, 90, 180, 270] as RotationValue[])(
    'computes the overlay position for a %d degree rotation',
    rotation => {
      const result = getOverlayTopLeft({
        imageContainerRect,
        imageRect,
        rotation,
        x,
        y,
      });

      expect(result).toEqual(expectedByRotation[rotation]);
    }
  );
});
