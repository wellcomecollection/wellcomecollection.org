// @flow
import type {ImagePromo} from './image-promo';

export type Place = {|
  id: string,
  title: string,
  level: ?number,
  capacity: ?number,
  promo: ?ImagePromo,
  body: any[]
|};
