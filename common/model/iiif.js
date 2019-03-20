// @flow
export type IIIFImageServiceSize = {|
  width: number,
  height: number,
|};

export type IIIFImageService = {|
  '@id': string,
|};

export type IIIFThumbnailService = {|
  '@id': string,
  sizes: IIIFImageServiceSize[],
|};

export type IIIFThumbnail = {|
  '@id': string,
  service: IIIFImageService,
|};

export type IIIFResource = {|
  '@id': string,
  service: {
    '@id': string,
  },
|};

export type IIIFImage = {|
  resource: IIIFResource,
|};

export type IIIFCanvas = {|
  '@id': string,
  thumbnail: IIIFThumbnail,
  images: IIIFImage[],
  width: number,
  height: number,
|};

export type IIIFRendering = {|
  '@id': string,
  format: string,
  label: string,
|};

export type IIIFSequence = {|
  '@id': string,
  '@type': string,
  canvases: IIIFCanvas[],
  rendering: IIIFRendering[],
|};
type IIIFStructure = {|
  '@id': string,
  '@type': string,
  label: string,
  canvases: string[],
|};

export type IIIFMetadata = {|
  label: string,
  value: string,
|};

export type IIIFManifest = {|
  '@id': string,
  label: string,
  metadata: IIIFMetadata[],
  sequences: IIIFSequence[],
  structures: IIIFStructure[],
|};
