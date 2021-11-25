import { Picture } from './picture';
import { Place } from './places';
import { Contributor } from './contributors';
import { ImageType } from './image';
import { GenericContentFields } from './generic-content-fields';
import { Resource } from './resource';
import { Season } from './seasons';
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
  contributors: Contributor[];
  place?: Place;
  exhibits: {
    exhibitType: 'exhibitions';
    item: Exhibition;
  };
  resources: Resource[];
  relatedIds: string[];
  seasons: Season[];
};

export type ExhibitionPromo = {
  id: string;
  format?: ExhibitionFormat;
  url: string;
  title: string;
  shortTitle?: string;
  image?: ImageType;
  squareImage?: Picture;
  start?: Date;
  end?: Date;
  statusOverride?: string;
};

export type UiExhibition = Exhibition & {
  promo?: ExhibitionPromo;
  galleryLevel: number; // this should be deprecated for place
  featuredImageList: Picture[];
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
