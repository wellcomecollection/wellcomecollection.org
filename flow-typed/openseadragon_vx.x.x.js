declare function OpenSeadragon({|
  id: string,
  visibilityRatio: number,
  showFullPageControl: boolean,
  showHomeControl: boolean,
  zoomInButton: string,
  zoomOutButton: string,
  showNavigator: boolean,
  controlsFadeDelay: number,
  tileSources: Array<Object>
|}): () => void;
