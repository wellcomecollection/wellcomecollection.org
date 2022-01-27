import { Picture } from './picture';
import { Place } from './places';
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
  accessContentOverride?: string;
  place?: Place;
  exhibits: Exhibit[];
  resources: Resource[];
  relatedIds: string[];
  seasons: Season[];
  prismicDocument: any;
};

// TODO: I'm pretty sure we don't use this featuredImageList anywhere,
// and we could collapse this into Exhibition.
export type UiExhibition = Exhibition & {
  featuredImageList: Picture[];
};

export type Exhibit = {
  exhibitType: 'exhibitions';
  item: Exhibition;
};

export type UiExhibit = {
  exhibitType: 'exhibitions';
  item: UiExhibition;
};
