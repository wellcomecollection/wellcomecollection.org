import { createContext, RefObject } from 'react';
import { Work } from '@weco/catalogue/services/wellcome/catalogue/types';
import { SearchResults } from '@weco/catalogue/services/iiif/types/search/v3';
import { Manifest } from '@iiif/presentation-3';
import {
  TransformedManifest,
  createDefaultTransformedManifest,
} from '../../types/manifest';
import { UrlTemplate } from 'url-template';

export type RotatedImage = { canvasParam: number; rotation: number };

type Props = {
  work: Work; // TODO update type to be WorkBasic?
  transformedManifest: TransformedManifest;
  // TODO get these from router where needed, as not all components rerender whenever they change
  query: {
    pageParam: number;
    canvasParam: number;
    manifestParam: number;
    shouldScrollToCanvas: boolean;
  };
  gridVisible: boolean;
  setGridVisible: (v: boolean) => void;
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
  setIsFullscreen: (v: boolean) => void;
  rotatedImages: RotatedImage[];
  setRotatedImages: (v: RotatedImage[]) => void;
  showControls: boolean;
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
  searchResults: results,
  setSearchResults: () => undefined,

  // UI props:
  viewerRef: undefined,
  mainAreaRef: undefined,
  gridVisible: false,
  setGridVisible: () => false,
  mainAreaWidth: 1000,
  mainAreaHeight: 500,
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
  errorHandler: () => undefined,

  // TODO remove everything below here:
  iiifImageLocationCredit: '', // TODO don't think we use this anymore

  // TODO move to correct section
  parentManifest: undefined, // TODO ????
  setParentManifest: () => undefined, // ????
  urlTemplate: undefined, // TODO ????

  // TODO possibly remove
  // it is just used to show/hide things when the window is resizing but not sure this is necessary
  isResizing: false,
});
export default ItemViewerContext;
