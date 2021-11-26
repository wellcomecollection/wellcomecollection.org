import { Picture } from './picture';
import { Place } from './places';
import { Contributor } from './contributors';
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
  prismicDocument: any;
};

export type UiExhibition = Exhibition & {
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
