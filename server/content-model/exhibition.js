// @flow
import {List} from 'immutable';
import type {ImagePromo} from './content-blocks';
import type {Picture} from '../model/picture';
import type {BodyPart} from '../model/body-part';

export type Exhibition = {|
  id: string;
  title: ?string;
  start: Date;
  end: ?Date;
  subtitle: ?string;
  intro: ?string;
  featuredImages: List<any>;
  featuredImage: ?Picture;
  description: ?string;
  promo: ?ImagePromo;
  body: Array<BodyPart>;
|}
