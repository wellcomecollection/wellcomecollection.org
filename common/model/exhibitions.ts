import { Picture } from './picture';
import { Place } from './places';
import { GenericContentFields } from './generic-content-fields';
import { Resource } from './resource';
import { Season } from './seasons';
import { HTMLString } from '../services/prismic/types';
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
  bslInfo?: HTMLString;
  audioDescriptionInfo?: HTMLString;
  place?: Place;
  exhibits: Exhibit[];
  resources: Resource[];
  relatedIds: string[];
  seasons: Season[];
};

export type Exhibit = {
  exhibitType: 'exhibitions';
  item: Exhibition;
};

export type UiExhibit = {
  exhibitType: 'exhibitions';
  item: Exhibition;
};
