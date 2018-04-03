// @flow
import type {HTMLString} from '../services/prismic/types';
import type {Picture} from './picture';
import type {Installation} from './installations';
import type {ImagePromo} from './image-promo';
import type {Place} from './place';
import type {Contributor} from './contributors';

type Exhibit = {|
  exhibitType: | 'installations',
  item: | Installation
|}

export type Exhibition = {|
  id: string,
  title: ?string,
  start: Date,
  end: ?Date,
  intro: ?string,
  description: HTMLString,
  contributors: Contributor[],
  place: ?Place,
  exhibits: Exhibit[]
|}

export type UiExhibition = {| ...Exhibition,  ...{|
  promo: ?ImagePromo,
  galleryLevel: number, // this should be deprecated for place
  textAndCaptionsDocument: any, // TODO: <= not this
  featuredImageList: Picture[],
  relatedBooks: ImagePromo[],
  relatedEvents: ImagePromo[],
  relatedGalleries: ImagePromo[],
  relatedArticles: ImagePromo[]
|}|}
