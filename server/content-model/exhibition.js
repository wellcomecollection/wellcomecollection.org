// @flow
import {List} from 'immutable';
import type {ImagePromo, DateRange} from './content-blocks';
import type {Picture} from '../model/picture';
import type {BodyPart} from '../model/body-part';

export type Exhibition = {|
  id: string;
  title: ?string;
  start: ?DateRange;
  end: ?DateRange;
  subtitle: ?string;
  intro: ?string;
  featuredImages: List<any>;
  featuredImage: ?Picture;
  description: ?string;
  promo: ?ImagePromo;
  body: Array<BodyPart>;
|}
