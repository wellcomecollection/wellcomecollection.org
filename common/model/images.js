import type {Props as TaslProps} from '../Tasl/Tasl';

export type Image = {|
  contentUrl: string,
  width: number,
  height: number,
  alt: string,
  credit: TaslProps
|}

export type UiImage = {|
  ...Image,
  caption: string,
  sizeQueries: string,
  lazyload: boolean,
  extraClasses?: string
|}
