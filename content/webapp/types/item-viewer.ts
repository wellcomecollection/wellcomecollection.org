import { Canvas, ImageService, Manifest } from '@iiif/presentation-3';

export type CanvasRotatedImage = { canvas: number; rotation: number };

// The viewer often works with a stub of an image service that holds only the
// service URL, e.g. `{ '@id': canvas.imageServiceId }`
export type PartialImageService = Pick<ImageService, '@id'>;

export type ItemViewerQuery = {
  canvas: number;
  manifest: number;
  query: string;
  page: number;
  shouldScrollToCanvas: boolean;
};

export type ParentManifest = Pick<Manifest, 'behavior'> & {
  canvases: Pick<Canvas, 'id' | 'label'>[];
};
