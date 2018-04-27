// @flow
import type {ImagePromo} from './image-promo';

export type InfoPage = {|
  type: 'info-pages',
  id: string,
  title: string,
  promo: ?ImagePromo,
  body: any[]
|}
