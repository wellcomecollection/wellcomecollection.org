import {
  CanvasContrastImage,
  CanvasRotatedImage,
} from '@weco/content/types/item-viewer';

export function toggleCanvasInArray(arr: number[], canvas: number): number[] {
  return arr.includes(canvas)
    ? arr.filter(v => v !== canvas)
    : [...arr, canvas];
}

export function updateContrastImages(
  arr: CanvasContrastImage[],
  canvas: number,
  value: number
): CanvasContrastImage[] {
  const idx = arr.findIndex(c => c.canvas === canvas);
  if (idx >= 0) {
    return arr.map((c, i) => (i === idx ? { ...c, contrast: value } : c));
  }
  return [...arr, { canvas, contrast: value }];
}

export function updateRotatedImages(
  rotatedImages: CanvasRotatedImage[],
  canvasParam: number
): CanvasRotatedImage[] {
  const matchingIndex = rotatedImages.findIndex(r => r.canvas === canvasParam);
  if (matchingIndex >= 0) {
    return rotatedImages.map((rotatedImage, i) => {
      if (matchingIndex === i) {
        const currentRotationValue = rotatedImages[matchingIndex].rotation;
        const newRotationValue =
          currentRotationValue < 270 ? currentRotationValue + 90 : 0;
        return { canvas: rotatedImage.canvas, rotation: newRotationValue };
      }
      return rotatedImage;
    });
  }
  return [...rotatedImages, { canvas: canvasParam, rotation: 90 }];
}

export function buildCssFilter({
  isInverted,
  isGrayscale,
  contrast,
}: {
  isInverted: boolean;
  isGrayscale: boolean;
  contrast: number;
}): string {
  let filter = '';
  if (isInverted) filter += 'invert(100%) ';
  if (isGrayscale) filter += 'grayscale(100%) ';
  if (contrast !== 100) filter += `contrast(${contrast}%) `;
  return filter.trim();
}
