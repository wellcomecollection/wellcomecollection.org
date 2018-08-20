// @flow
import type {HTMLString} from '../services/prismic/types';
import type {Picture} from './picture';
import type {Installation, UiInstallation} from './installations';
import type {ImagePromo} from './image-promo';
import type {Place} from './places';
import type {Contributor} from './contributors';
import type {Image} from './image';
import type {GenericContentFields} from './generic-content-fields';

export type Exhibit = {|
  exhibitType: | 'installations',
  item: | Installation
|}

export type UiExhibit = {|
  exhibitType: | 'installations',
  item: | UiInstallation
|}

// e.g. 'Permanent'
export type ExhibitionFormat = {|
  id: string,
  title: string,
  description: ?string
|}

export type Exhibition = {|
  ...GenericContentFields,
  format: ?ExhibitionFormat,
  start: Date,
  end: ?Date,
  isPermanent: boolean,
  statusOverride: ?string,
  intro: ?HTMLString,
  description: HTMLString,
  contributors: Contributor[],
  place: ?Place,
  exhibits: Exhibit[]
|}

export type ExhibitionPromo = {|
  id: string,
  format: ?ExhibitionFormat,
  url: string,
  title: string,
  image: Image,
  description: string,
  start: Date,
  end: ?Date,
  statusOverride: ?string
|}

export type UiExhibition = {| ...Exhibition,  ...{|
  promo: ?ExhibitionPromo,
  galleryLevel: number, // this should be deprecated for place
  textAndCaptionsDocument: any, // TODO: <= not this
  featuredImageList: Picture[],
  relatedBooks: ImagePromo[],
  relatedEvents: ImagePromo[],
  relatedGalleries: ImagePromo[],
  relatedArticles: ImagePromo[],
  exhibits: UiExhibit[]
|}|}
