// @flow
import type { HTMLString } from '../services/prismic/types';
import type { Picture } from './picture';
import type { ImagePromo } from './image-promo';
import type { Place } from './places';
import type { Contributor } from './contributors';
import type { ImageType } from './image';
import type { GenericContentFields } from './generic-content-fields';
import type { Resource } from './resource';

// e.g. 'Permanent'
export type ExhibitionFormat = {|
  id: string,
  title: string,
  description: ?string,
|};

export type Exhibition = {|
  ...GenericContentFields,
  type: 'exhibitions',
  format: ?ExhibitionFormat,
  start: Date,
  end: ?Date,
  isPermanent: boolean,
  statusOverride: ?string,
  intro: ?HTMLString,
  description: HTMLString,
  contributors: Contributor[],
  place: ?Place,
  exhibits: {|
    exhibitType: 'exhibitions',
    item: Exhibition,
  |},
  resources: Resource[],
  relatedIds: string[],
|};

export type ExhibitionPromo = {|
  id: string,
  format: ?ExhibitionFormat,
  url: string,
  title: string,
  image: ImageType,
  squareImage: ?Picture,
  description: string,
  start: Date,
  end: ?Date,
  statusOverride: ?string,
|};

export type UiExhibition = {|
  ...Exhibition,
  ...{|
    promo: ?ExhibitionPromo,
    galleryLevel: number, // this should be deprecated for place
    textAndCaptionsDocument: any, // TODO: <= not this
    featuredImageList: Picture[],
    relatedBooks: ImagePromo[],
    relatedEvents: ImagePromo[],
    relatedGalleries: ImagePromo[],
    relatedArticles: ImagePromo[],
    exhibits: {|
      exhibitType: 'exhibitions',
      item: UiExhibition,
    |}[],
  |},
|};

// We don't use these types for exhibits above
// as it creates a `needs to be defined before use` error.
export type Exhibit = {|
  exhibitType: 'exhibitions',
  item: Exhibition,
|};

export type UiExhibit = {|
  exhibitType: 'exhibitions',
  item: UiExhibition,
|};
