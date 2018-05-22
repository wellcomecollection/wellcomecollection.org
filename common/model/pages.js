// @flow
import type {ImagePromo} from './image-promo';

export type Page = {|
  type: 'pages',
  id: string,
  title: string,
  promo: ?ImagePromo,
  body: any[],
  datePublished: ?Date,
  // This is just for now, we will be implementing a proper site tagging
  // strategy for this later
  siteSection: ?string,
  // TODO (drupal migration): This is used while we add the credit and
  // alt for Drupal content
  drupalPromoImage: ?string,
  drupalNid: ?string,
  drupalPath: ?string
|}
