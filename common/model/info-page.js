// @flow
import type {ImagePromo} from './image-promo';

export type InfoPage = {|
  id: string,
  title: string,
  promo: ?ImagePromo,
  body: any[]
|}
