// @flow
import type {ImagePromo} from './image-promo';

export type InfoPage = {|
  type: 'info-pages',
  id: string,
  title: string,
  promo: ?ImagePromo,
  body: any[],
  // TODO (drupal migration): This is used while we add the credit and
  // alt for Drupal content
  drupalPromoImage: ?string,
  drupalNid: ?string,
  drupalPath: ?string
|}
