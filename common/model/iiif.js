// @flow
export type IIIFImageServiceSize = {|
  width: number,
  height: number,
|};

export type IIIFImageService = {|
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
|};

export type IIIFSequence = {|
  '@id': string,
  canvases: IIIFCanvas[],
|};

export type IIIFManifest = {|
  '@id': string,
  label: string,
  sequences: IIIFSequence[],
|};
