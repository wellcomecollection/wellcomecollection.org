// @flow
import type {Tasl} from './tasl';

// We call this ImageType to not conflict with the native DOM Image
export type ImageType = {|
  contentUrl: string,
  width: number,
  height: number,
  alt: string,
  tasl: Tasl
|}
