// @flow
export type IIIFThumbnail = {|
  '@id': string
|}

export type IIIFCanvas = {|
  thumbnail: IIIFThumbnail
|}

export type IIIFSequence = {|
  '@id': string,
  canvases: IIIFCanvas[]
|}
