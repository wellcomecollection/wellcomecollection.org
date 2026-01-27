import { createContext, RefObject, useContext } from 'react';

import { SearchResults } from '@weco/content/services/iiif/types/search/v3';
import {
  Work,
  WorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';
import {
  CanvasRotatedImage,
  ItemViewerQuery,
  ParentManifest,
} from '@weco/content/types/item-viewer';
import { TransformedManifest } from '@weco/content/types/manifest';

type Props = {
  // DATA props:
  query: ItemViewerQuery;
  work: WorkBasic & Pick<Work, 'description'>;
  transformedManifest: TransformedManifest | undefined;
  parentManifest: ParentManifest | undefined;
  searchResults: SearchResults | null;
  setSearchResults: (v) => void;
  accessToken: string | undefined;

  // UI props:
  viewerRef: RefObject<HTMLDivElement | null> | undefined;
  mainAreaRef: RefObject<HTMLDivElement | null> | undefined;
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
  showFullscreenControl: boolean;
  setShowFullscreenControl: (v: boolean) => void;
  showControls: boolean;
  setShowControls: (v: boolean) => void;
  rotatedImages: CanvasRotatedImage[];
  setRotatedImages: (v: CanvasRotatedImage[]) => void;
  isResizing: boolean;
  errorHandler?: () => void;
  useFixedSizeList: boolean;
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
  showFullscreenControl: false,
  setShowFullscreenControl: () => undefined,
  rotatedImages: [],
  setRotatedImages: () => undefined,
  isResizing: false,
  errorHandler: () => undefined,
  useFixedSizeList: false,
});

export function useItemViewerContext(): Props {
  const contextState = useContext(ItemViewerContext);
  return contextState;
}

export default ItemViewerContext;
