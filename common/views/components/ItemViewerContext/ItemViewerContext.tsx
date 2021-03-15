import { createContext } from 'react';
import { Work } from '../../../model/catalogue';
import { IIIFCanvas, IIIFManifest, IIIFRendering } from '../../../model/iiif';
import { LicenseData } from '../../../utils/licenses';

type Props = {
  work: Work;
  manifest: IIIFManifest;
  manifestIndex: number | undefined;
  activeIndex: number | undefined;
  setActiveIndex: (i: number) => void;
  canvases: IIIFCanvas[];
  canvasIndex: number | undefined;
  gridVisible: boolean;
  setGridVisible: (v: boolean) => void;
  currentManifestLabel?: string;
  licenseInfo: LicenseData;
  iiifImageLocationCredit: string;
  downloadOptions: IIIFRendering[];
  iiifPresentationDownloadOptions: IIIFRendering[];
  parentManifest: IIIFManifest | undefined;
  lang: string;
  mainAreaWidth: number;
  mainAreaHeight: number;
  isFullscreen: boolean;
  setShowZoomed: (v: boolean) => void;
  isSidebarActive: boolean;
  setIsSidebarActive: (v: boolean) => void;
  showZoomed: boolean;
  setZoomInfoUrl: (v: string) => void;
  setIsFullscreen: (v: boolean) => void;
  zoomInfoUrl: string;
  setRotatedImages: any;
  showControls: boolean;
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
  setImageJson: any;
  setParentManifest: (v: IIIFManifest) => void;
  rotatedImages: any;
  setShowControls: any;
  errorHandler: any;
  setCurrentManifestLabel: (v: string) => void;
};
const ItemViewerContext = createContext<Props>({
  work: {},
  manifest: {},
  manifestIndex: undefined,
  activeIndex: undefined,
  canvases: [],
  canvasIndex: undefined,
  gridVisible: false,
  currentManifestLabel: undefined,
  licenseInfo: undefined,
  iiifImageLocationCredit: undefined,
  downloadOptions: undefined,
  iiifPresentationDownloadOptions: undefined,
  parentManifest: undefined,
  lang: '',
  mainAreaWidth: 1000,
  mainAreaHeight: 500,
  isFullscreen: false,
  isSidebarActive: false,
  showZoomed: false,
  setZoomInfoUrl: undefined,
  zoomInfoUrl: undefined,
  showControls: false,
  isLoading: false,
  rotatedImages: [],
  setActiveIndex: () => undefined,
  setGridVisible: () => false,
  setShowZoomed: () => undefined,
  setIsSidebarActive: () => undefined,
  setIsFullscreen: () => undefined,
  setRotatedImages: () => undefined,
  setIsLoading: () => undefined,
  setImageJson: () => undefined,
  setParentManifest: () => undefined,
  setShowControls: () => undefined,
  errorHandler: () => undefined,
  setCurrentManifestLabel: () => undefined,
});
export default ItemViewerContext;
