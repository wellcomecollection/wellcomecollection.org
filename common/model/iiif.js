// @flow
export type IIIFThumbnail = {|
  '@id': string
|}

export type IIIFResource = {|
  '@id': string
|}

export type IIIFImage = {|
  resource: IIIFResource
|}

export type IIIFCanvas = {|
  thumbnail: IIIFThumbnail,
  images: IIIFImage[]
|}

export type IIIFSequence = {|
  '@id': string,
  canvases: IIIFCanvas[]
|}
