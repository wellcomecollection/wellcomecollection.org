import { Canvas, Manifest } from '@iiif/presentation-3';
import { createContext, RefObject } from 'react';

import { SearchResults } from '@weco/content/services/iiif/types/search/v3';
import {
  Work,
  WorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';
import { TransformedManifest } from '@weco/content/types/manifest';

export type RotatedImage = { canvas: number; rotation: number };

export type Query = {
  canvas: number;
  manifest: number;
  query: string;
  page: number;
  shouldScrollToCanvas: boolean;
};

export type ParentManifest = Pick<Manifest, 'behavior'> & {
  canvases: Pick<Canvas, 'id' | 'label'>[];
};

type Props = {
  // DATA props:
  query: Query;
  work: WorkBasic & Pick<Work, 'description'>;
  transformedManifest: TransformedManifest | undefined;
  parentManifest: ParentManifest | undefined;
  searchResults: SearchResults | null;
  setSearchResults: (v) => void;
  accessToken: string | undefined;

  // UI props:
  viewerRef: RefObject<HTMLDivElement> | undefined;
  mainAreaRef: RefObject<HTMLDivElement> | undefined;
  mainAreaWidth: number;
  mainAreaHeight: number;
  gridVisible: boolean;
  setGridVisible: (v: boolean) => void;
  isFullscreen: boolean;
  setIsFullscreen: (v: boolean) => void;
  isDesktopSidebarActive: boolean;
  setIsDesktopSidebarActive: (v: boolean) => void;
  isMobileSidebarActive: boolean;
  setIsMobileSidebarActive: (v: boolean) => void;
  showZoomed: boolean;
  setShowZoomed: (v: boolean) => void;
  showControls: boolean;
  setShowControls: (v: boolean) => void;
  rotatedImages: RotatedImage[];
  setRotatedImages: (v: RotatedImage[]) => void;
  isResizing: boolean;
  errorHandler?: () => void;
};

export const results = {
  '@context': '',
  '@id': '',
  '@type': 'sc:AnnotationList',
  within: {
    '@type': '',
    total: null,
  },
  startIndex: 0,
  resources: [],
  hits: [],
};

const query = {
  canvas: 1,
  manifest: 1,
  query: '',
  page: 1,
  shouldScrollToCanvas: true,
};

const work: WorkBasic & Pick<Work, 'description'> = {
  id: '',
  title: '',
  description: undefined,
  languageId: undefined,
  thumbnail: undefined,
  referenceNumber: undefined,
  productionDates: [],
  archiveLabels: undefined,
  cardLabels: [],
  primaryContributorLabel: undefined,
  notes: [],
};

const ItemViewerContext = createContext<Props>({
  // DATA props:
  query,
  work,
  transformedManifest: undefined,
  parentManifest: undefined,
  searchResults: results,
  setSearchResults: () => undefined,
  accessToken: undefined,

  // UI props:
  viewerRef: undefined,
  mainAreaRef: undefined,
  mainAreaWidth: 1000,
  mainAreaHeight: 500,
  gridVisible: false,
  setGridVisible: () => false,
  isFullscreen: false,
  setIsFullscreen: () => undefined,
  isDesktopSidebarActive: true,
  setIsDesktopSidebarActive: () => undefined,
  isMobileSidebarActive: false,
  setIsMobileSidebarActive: () => undefined,
  showZoomed: false,
  setShowZoomed: () => undefined,
  showControls: false,
  setShowControls: () => undefined,
  rotatedImages: [],
  setRotatedImages: () => undefined,
  isResizing: false,
  errorHandler: () => undefined,
});
export default ItemViewerContext;
