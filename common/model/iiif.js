// @flow
export type IIIFImageServiceSize = {|
  width: number,
  height: number,
|};

export type IIIFImageService = {|
  '@id': string,
  sizes?: IIIFImageServiceSize[],
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

export type IIIFSequence = {|
  '@id': string,
  '@type': string,
  canvases: IIIFCanvas[],
|};
type IIIFStructure = {|
  '@id': string,
  '@type': string,
  label: string,
  canvases: string[],
|};

export type IIIFManifest = {|
  '@id': string,
  label: string,
  sequences: IIIFSequence[],
  structures: IIIFStructure[],
|};
