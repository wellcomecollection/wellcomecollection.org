// @flow
import type {HTMLString} from '../services/prismic/types';
import type {Picture} from './picture';
import type {Installation, UiInstallation} from './installations';
import type {ImagePromo} from './image-promo';
import type {Place} from './place';
import type {Contributor} from './contributors';
import type {Image} from './image';

export type Exhibit = {|
  exhibitType: | 'installations',
  item: | Installation
|}

export type UiExhibit = {|
  exhibitType: | 'installations',
  item: | UiInstallation
|}

export type Exhibition = {|
  id: string,
  title: ?string,
  start: Date,
  end: ?Date,
  intro: ?HTMLString,
  description: HTMLString,
  contributors: Contributor[],
  place: ?Place,
  exhibits: Exhibit[]
|}

export type ExhibitionPromo = {|
  id: string,
  url: string,
  title: string,
  image: Image,
  description: string,
  start: Date,
  end: ?Date,
|}

export type UiExhibition = {| ...Exhibition,  ...{|
  promo: ExhibitionPromo,
  galleryLevel: number, // this should be deprecated for place
  textAndCaptionsDocument: any, // TODO: <= not this
  featuredImageList: Picture[],
  relatedBooks: ImagePromo[],
  relatedEvents: ImagePromo[],
  relatedGalleries: ImagePromo[],
  relatedArticles: ImagePromo[],
  exhibits: UiExhibit[]
|}|}
