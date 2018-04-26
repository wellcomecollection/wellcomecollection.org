// @flow
import type {Tasl} from './tasl';

export type Image = {|
  contentUrl: string,
  width: number,
  height: number,
  alt: string,
  tasl: Tasl
|}
