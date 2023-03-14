import { createContext } from 'react';
import { Work } from '@weco/catalogue/services/catalogue/types';
import { SearchResults } from '../../services/iiif/types/search/v3';
import { Manifest } from '@iiif/presentation-3';
import {
  DownloadOption,
  TransformedManifest,
  createDefaultTransformedManifest,
} from '../../types/manifest';
import { UrlTemplate } from 'url-template';

export type RotatedImage = { canvasIndex: number; rotation: number };

type Props = {
  work: Work;
  transformedManifest: TransformedManifest;
  manifestIndex: number | undefined;
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  canvasIndex: number;
  gridVisible: boolean;
  setGridVisible: (v: boolean) => void;
  currentManifestLabel?: string;
  iiifImageLocationCredit: string | undefined;
  downloadOptions: DownloadOption[]; // This can be downloads from a manifest or created from a iiif-image location
  parentManifest: Manifest | undefined;
  lang: string;
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
  setRotatedImages: (v: RotatedImage[]) => void;
  showControls: boolean;
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
  setParentManifest: (v: Manifest) => void;
  rotatedImages: { canvasIndex: number; rotation: number }[];
  setShowControls: (v: boolean) => void;
  errorHandler?: () => void;
  setCurrentManifestLabel: (v: string) => void;
  searchResults: SearchResults;
  setSearchResults: (v) => void;
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

const ItemViewerContext = createContext<Props>({
  work: {
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
  manifestIndex: undefined,
  activeIndex: 0,
  canvasIndex: 0,
  gridVisible: false,
  currentManifestLabel: undefined,
  iiifImageLocationCredit: '',
  downloadOptions: [],
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
  setActiveIndex: () => undefined,
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
});
export default ItemViewerContext;
