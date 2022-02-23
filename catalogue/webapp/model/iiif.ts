export type IIIFImageServiceSize = {
  width: number;
  height: number;
};

export type IIIFImageService = {
  '@id': string;
};

export type IIIFThumbnailService = {
  '@id': string;
  sizes: IIIFImageServiceSize[];
};

export type IIIFThumbnail = {
  '@id': string;
  service: IIIFThumbnailService | IIIFThumbnailService[];
};

export type IIIFResource = {
  '@id': string;
  service:
    | {
        '@id': string;
      }
    | {
        '@id': string;
        '@context': string;
        service: [];
      }[];
};

export type IIIFImage = {
  resource: IIIFResource;
};

export type IIIFCanvas = {
  '@id': string;
  thumbnail: IIIFThumbnail;
  label: string;
  images: IIIFImage[];
  width: number;
  height: number;
  otherContent: any[];
};

export type IIIFStructure = {
  '@id': string;
  '@type': string;
  label: string;
  canvases?: string[];
};

export type IIIFRendering = {
  '@id': string;
  format: string;
  label: string;
  width?: 'full' | number;
};

export type IIIFAnnotationResource = {
  '@type': 'oa:Annotation';
  resource: {
    '@id': string;
    format: string;
    label: string;
  };
};

export type IIIFMediaElement = {
  '@id': string;
  '@type': 'dctypes:Sound' | 'dctypes:MovingImage';
  format: string;
  label: string;
  metadata: [];
  thumbnail: string;
  rendering: {
    '@id': string;
    format: string;
  };
  height?: number;
  width?: number;
  resources?: IIIFAnnotationResource[];
  service?: AuthService | AuthService[];
};

export type IIIFLabelV3 = Record<string, string[]>;

export type IIIFMediaElementV3 = {
  duration: number;
  id: string;
  type: 'Sound' | 'Audio' | 'Video';
  label: IIIFLabelV3;
  format: string;
  service?: AuthService[];
  height?: number;
  width?: number;
};

export type AudioV3 = {
  title?: string;
  sounds: {
    sound: IIIFMediaElementV3;
    title?: string;
  }[];
  thumbnail?: IIIFImageV3;
  transcript?: IIIFTextV3;
};

type IIIFMediaSequence = {
  '@id': string;
  '@type': string;
  elements: IIIFMediaElement[];
};

export type IIIFSequence = {
  '@id': string;
  '@type': string;
  compatibilityHint: string;
  canvases: IIIFCanvas[];
  rendering: IIIFRendering[];
};

export type IIIFMetadata = {
  label: string;
  value: string;
};

export type AuthServiceService = {
  '@context': string;
  '@id': string;
  profile: string;
};

export type AuthService = {
  '@context': string;
  '@id': string;
  description: string;
  label: string;
  profile: string;
  service: AuthServiceService[];
};

export type Service = {
  profile: string;
  disableUI?: string[];
  authService?: AuthService;
  accessHint?: string;
};

export type IIIFManifest = {
  '@id': string;
  label: string;
  manifests: any; // TODO
  metadata: IIIFMetadata[];
  mediaSequences?: IIIFMediaSequence[];
  sequences?: IIIFSequence[];
  structures?: IIIFStructure[];
  license: string;
  within?: string;
  service?: Service | Service[];
};

export type IIIFTextV3 = {
  id: string;
  type: 'Text';
  label: IIIFLabelV3;
  format: string;
  language: IIIFLabelV3;
};

export type IIIFImageV3 = {
  id: string;
  type: 'Image';
  label: IIIFLabelV3;
  format: string;
};

export type IIIFMetadataV3 = {
  label: IIIFLabelV3;
  value: IIIFLabelV3;
};

export type IIIFAnnotationV3 = {
  id: string;
  type: 'Annotation';
  motivation: string;
  body: IIIFMediaElementV3 | IIIFImageV3;
  target: string;
};

export type IIIFAnnotationpageV3 = {
  id: string;
  type: 'AnnotationPage';
  items: IIIFAnnotationV3[];
};

export type IIIFCanvasV3 = {
  id: string;
  type: 'Canvas';
  label: IIIFLabelV3;
  width?: number;
  height?: number;
  duration?: number;
  items: IIIFAnnotationpageV3[];
};

export type IIIFManifestV3 = {
  '@context': string;
  id: string;
  type: string;
  label: IIIFLabelV3;
  summary: IIIFLabelV3;
  homepage: IIIFTextV3[];
  metadata: IIIFMetadataV3[];
  items: IIIFCanvasV3[];
  placeholderCanvas: IIIFCanvasV3;
  rendering?: IIIFTextV3[];
  services?: (IIIFTextV3 | AuthService)[];
};

export type SearchService = {
  '@context': string;
  '@id': string;
  profile: string;
  label: string;
};

export type SearchResults = {
  '@context': string;
  '@id': string;
  '@type': string;
  within: {
    '@type': string;
    total: number | null;
  };
  startIndex: number;
  resources: {
    '@id': string;
    '@type': 'oa:Annotation';
    motivation: string;
    resource: {
      '@type': string;
      chars: string;
    };
    on: string;
  }[];
  hits: {
    '@type': string;
    annotations: string[];
    match: string;
    before: string;
    after: string;
  }[];
};
