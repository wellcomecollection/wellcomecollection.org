import { createContext } from 'react';
import { Work } from '../../../model/catalogue';
import {
  IIIFCanvas,
  IIIFManifest,
  IIIFRendering,
  SearchResults,
} from '../../../model/iiif';
import { LicenseData } from '../../../utils/licenses';
import { UrlTemplate } from 'url-template';
type Props = {
  work: Work;
  manifest: IIIFManifest | undefined;
  manifestIndex: number | undefined;
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  canvases: IIIFCanvas[];
  canvasIndex: number;
  gridVisible: boolean;
  setGridVisible: (v: boolean) => void;
  currentManifestLabel?: string;
  licenseInfo: LicenseData;
  iiifImageLocationCredit: string | undefined;
  downloadOptions: IIIFRendering[];
  iiifPresentationDownloadOptions: IIIFRendering[];
  parentManifest: IIIFManifest | undefined;
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
  setRotatedImages: (v: { canvasIndex: number; rotation: number }[]) => void;
  showControls: boolean;
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
  setImageJson: (v: boolean) => void;
  setParentManifest: (v: IIIFManifest) => void;
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
    parts: [],
    partOf: [],
    precededBy: [],
    succeededBy: [],
    availabilities: [],
    availableOnline: false,
    holdings: [],
  },
  manifest: undefined,
  manifestIndex: undefined,
  activeIndex: 0,
  canvases: [],
  canvasIndex: 0,
  gridVisible: false,
  currentManifestLabel: undefined,
  licenseInfo: undefined,
  iiifImageLocationCredit: '',
  downloadOptions: [],
  iiifPresentationDownloadOptions: [],
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
  setImageJson: () => undefined,
  setParentManifest: () => undefined,
  setShowControls: () => undefined,
  errorHandler: () => undefined,
  setCurrentManifestLabel: () => undefined,
  setSearchResults: () => undefined,
});
export default ItemViewerContext;
