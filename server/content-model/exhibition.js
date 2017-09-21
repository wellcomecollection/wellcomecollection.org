// @flow
import {List} from 'immutable';
import type {ImagePromo, DateRange} from './content-blocks';
import type {Picture} from '../model/picture';

export type Exhibition = {|
  id: string;
  title: ?string;
  start: ?DateRange;
  end: ?DateRange;
  subtitle: ?string;
  featuredImages: List<Picture>;
  faeturedImage: ?Picture;
  description: ?string;
  promo: ?ImagePromo;
|}
