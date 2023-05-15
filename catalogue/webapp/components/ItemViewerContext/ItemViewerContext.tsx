import { createContext, RefObject } from 'react';
import { Work } from '@weco/catalogue/services/wellcome/catalogue/types';
import { SearchResults } from '@weco/catalogue/services/iiif/types/search/v3';
import { Manifest } from '@iiif/presentation-3';
import {
  DownloadOption,
  TransformedManifest,
  createDefaultTransformedManifest,
} from '../../types/manifest';
import { UrlTemplate } from 'url-template';

export type RotatedImage = { canvasParam: number; rotation: number };

type Props = {
  work: Work;
  transformedManifest: TransformedManifest;
  query: {
    pageParam: number;
    canvasParam: number;
    manifestParam: number;
    shouldScrollToCanvas: boolean;
  };
  gridVisible: boolean;
  setGridVisible: (v: boolean) => void;
  iiifImageLocationCredit: string | undefined;
  parentManifest: Manifest | undefined;
  mainAreaWidth: number;
  mainAreaHeight: number;
  isFullscreen: boolean;
  isResizing: boolean;
  urlTemplate?: UrlTemplate;
  setShowZoomed: (v: boolean) => void;
  isDesktopSidebarActive: boolean;
  setIsDesktopSidebarActive: (v: boolean) => void;
  isMobileSidebarActive: boolean;
  setIsMobileSidebarActive: (v: boolean) => void;
  showZoomed: boolean;
  setZoomInfoUrl: (v: string) => void;
  setIsFullscreen: (v: boolean) => void;
  zoomInfoUrl: string | undefined;
  rotatedImages: RotatedImage[];
  setRotatedImages: (v: RotatedImage[]) => void;
  showControls: boolean;
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
  setParentManifest: (v: Manifest) => void;
  setShowControls: (v: boolean) => void;
  errorHandler?: () => void;
  searchResults: SearchResults;
  setSearchResults: (v) => void;
  viewerRef: RefObject<HTMLDivElement> | undefined;
  mainAreaRef: RefObject<HTMLDivElement> | undefined;
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

// Separate DataContext and UI context - may improve performance? depends where they are used?
const ItemViewerContext = createContext<Props>({
  // DATA props:
  // TODO get these from router in each place, rather than adding to context then not everything will update if it changes
  query: {
    canvasParam: 1,
    pageParam: 1,
    manifestParam: 1,
    shouldScrollToCanvas: true,
  },
  work: {
    // TODO reduce data on work // TODO createDefaultWork
    type: 'Work',
    id: '',
    title: '',
    alternativeTitles: [],
    physicalDescription: '',
    workType: {
      id: '',
      label: '',
      type: 'Format',
    },
    contributors: [],
    identifiers: [],
    subjects: [],
    genres: [],
    production: [],
    languages: [],
    notes: [],
    formerFrequency: [],
    designation: [],
    parts: [],
    partOf: [],
    precededBy: [],
    succeededBy: [],
    availabilities: [],
    availableOnline: false,
    holdings: [],
  },
  transformedManifest: createDefaultTransformedManifest(),
  gridVisible: false,
  iiifImageLocationCredit: '',
  parentManifest: undefined,
  lang: '',
  mainAreaWidth: 1000,
  mainAreaHeight: 500,
  isFullscreen: false,
  isDesktopSidebarActive: true,
  isMobileSidebarActive: false,
  showZoomed: false,
  zoomInfoUrl: '',
  showControls: false,
  isLoading: false,
  rotatedImages: [],
  urlTemplate: undefined,
  searchResults: results,
  isResizing: false,
  setZoomInfoUrl: () => undefined,
  setGridVisible: () => false,
  setShowZoomed: () => undefined,
  setIsDesktopSidebarActive: () => undefined,
  setIsMobileSidebarActive: () => undefined,
  setIsFullscreen: () => undefined,
  setRotatedImages: () => undefined,
  setIsLoading: () => undefined,
  setParentManifest: () => undefined,
  setShowControls: () => undefined,
  errorHandler: () => undefined,
  setCurrentManifestLabel: () => undefined,
  setSearchResults: () => undefined,
  viewerRef: undefined,
  mainAreaRef: undefined,
});
export default ItemViewerContext;
