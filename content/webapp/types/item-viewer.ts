import { Canvas, Manifest } from '@iiif/presentation-3';

export type CanvasRotatedImage = { canvas: number; rotation: number };

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
