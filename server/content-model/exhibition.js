// @flow
import {List} from 'immutable';
import type {ImagePromo} from './content-blocks';
import type {Picture} from '../model/picture';
import type {BodyPart} from '../model/body-part';

export type ExhibitionFormat = {|
  id: string,
  title: string
|}

export type Exhibition = {|
  id: string,
  title: ?string,
  start: Date,
  end: ?Date,
  format: ?ExhibitionFormat,
  subtitle: ?string,
  intro: ?string,
  featuredImages: List<any>,
  featuredImage: ?Picture,
  description: ?string,
  promo: ?ImagePromo,
  body: Array<BodyPart>
|}
