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
  service: IIIFThumbnailService,
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
  label: string,
  images: IIIFImage[],
  width: number,
  height: number,
|};

export type IIIFRendering = {|
  '@id': string,
  format: string,
  label: string,
|};

type IIIFMediaSequence = {|
  '@id': string,
  '@type': string,
  elements: {
    '@type': string,
    '@id': string,
    format: string,
  }[],
|};

export type IIIFSequence = {|
  '@id': string,
  '@type': string,
  compatibilityHint: string,
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
  mediaSequences?: IIIFMediaSequence[],
  sequences?: IIIFSequence[],
  structures?: IIIFStructure[],
  license: string,
|};
