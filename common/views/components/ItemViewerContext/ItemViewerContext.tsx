import { createContext } from 'react';
type Props = {
  work: any;
  manifest: any;
  manifestIndex: any;
  activeIndex: any;
  setActiveIndex: any;
  canvases: any;
  canvasIndex: any;
  gridVisible: any;
  setGridVisible: any;
  currentManifestLabel: any;
  licenseInfo: any;
  iiifImageLocationCredit: any;
  downloadOptions: any;
  iiifPresentationDownloadOptions: any;
  parentManifest: any;
  lang: any;
  mainAreaWidth: any;
  mainAreaHeight: any;
  isFullscreen: any;
  setShowZoomed: any;
  isSidebarActive: any;
  setIsSidebarActive: any;
  showZoomed: any;
  setZoomInfoUrl: any;
  setIsFullscreen: any;
  zoomInfoUrl: any;
  setRotatedImages: any;
  showControls: any;
  isLoading: any;
  setIsLoading: any;
  setImageJson: any;
  setParentManifest: any;
  rotatedImages: any;
  setShowControls: any;
  errorHandler: any;
  setCurrentManifestLabel: any;
};
const ItemViewerContext = createContext<Props>({
  work: {},
  manifest: {},
  manifestIndex: undefined,
  activeIndex: undefined,
  setActiveIndex: undefined,
  canvases: [],
  canvasIndex: undefined,
  gridVisible: false,
  setGridVisible: () => false,
  currentManifestLabel: undefined,
  licenseInfo: undefined,
  iiifImageLocationCredit: undefined,
  downloadOptions: undefined,
  iiifPresentationDownloadOptions: undefined,
  parentManifest: undefined,
  lang: undefined,
  mainAreaWidth: undefined,
  mainAreaHeight: undefined,
  isFullscreen: undefined,
  setShowZoomed: () => undefined,
  isSidebarActive: false,
  setIsSidebarActive: () => undefined,
  showZoomed: false,
  setZoomInfoUrl: undefined,
  setIsFullscreen: false,
  zoomInfoUrl: undefined,
  setRotatedImages: () => undefined,
  showControls: false,
  isLoading: false,
  setIsLoading: () => undefined,
  setImageJson: () => undefined,
  setParentManifest: () => undefined,
  rotatedImages: [],
  setShowControls: () => undefined,
  errorHandler: () => undefined,
  setCurrentManifestLabel: () => undefined,
});
export default ItemViewerContext;
