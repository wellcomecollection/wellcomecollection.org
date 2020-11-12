import { HTMLString } from '../services/prismic/types';
import { Picture } from './picture';
import { ImagePromo } from './image-promo';
import { Place } from './places';
import { Contributor } from './contributors';
import { ImageType } from './image';
import { GenericContentFields } from './generic-content-fields';
import { Resource } from './resource';

// e.g. 'Permanent'
export type ExhibitionFormat = {
  id: string;
  title: string;
  description?: string;
};

export type Exhibition = GenericContentFields & {
  shortTitle?: string;
  type: 'exhibitions';
  format?: ExhibitionFormat;
  start: Date;
  end?: Date;
  isPermanent: boolean;
  statusOverride?: string;
  intro?: HTMLString;
  description: HTMLString;
  contributors: Contributor[];
  place?: Place;
  exhibits: {
    exhibitType: 'exhibitions';
    item: Exhibition;
  };
  resources: Resource[];
  relatedIds: string[];
};

export type ExhibitionPromo = {
  id: string;
  format?: ExhibitionFormat;
  url: string;
  title: string;
  shortTitle?: string;
  image: ImageType;
  squareImage?: Picture;
  start: Date;
  end?: Date;
  statusOverride?: string;
};

export type UiExhibition = Exhibition & {
  promo?: ExhibitionPromo;
  galleryLevel: number; // this should be deprecated for place
  textAndCaptionsDocument: any;
  featuredImageList: Picture[];
  relatedBooks: ImagePromo[];
  relatedEvents: ImagePromo[];
  relatedGalleries: ImagePromo[];
  relatedArticles: ImagePromo[];
  exhibits: Exhibit[];
};

export type Exhibit = {
  exhibitType: 'exhibitions';
  item: Exhibition;
};

export type UiExhibit = {
  exhibitType: 'exhibitions';
  item: UiExhibition;
};
