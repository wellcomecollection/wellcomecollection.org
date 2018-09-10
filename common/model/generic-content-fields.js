// @flow
import type {Contributor} from './contributors';
import type {ImagePromo} from './image-promo';
import type {Picture} from './picture';
import type {ImageType} from './image';

export type Body = any[];

// TODO: we need to get type in here to be able to union on these
// i.e. search results
export type GenericContentFields = {|
  id: string,
  title: string,
  contributorsTitle: ?string,
  contributors: Contributor[],
  promo: ?ImagePromo,
  body: any[],
  promoText: ?string,
  promoImage: ?Picture,
  image: ?ImageType,
  squareImage: ?ImageType,
  widescreenImage: ?ImageType,
  thinImage: ?ImageType
|}
