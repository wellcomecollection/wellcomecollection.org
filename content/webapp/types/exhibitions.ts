import { Article } from './articles';
import { Series } from './series';
import { Book } from './books';
import { Contributor, ContributorBasic } from './contributors';
import { EventBasic } from './events';
import { Place } from './places';
import { GenericContentFields } from './generic-content-fields';
import { Resource } from './resource';
import { Season } from './seasons';
import { ImagePromo } from './image-promo';
import { Label } from '@weco/common/model/labels';
import * as prismic from '@prismicio/client';

// e.g. 'Permanent'
export type ExhibitionFormat = {
  id: string;
  title: string;
  description?: string;
};

export type ExhibitionBasic = {
  // this is a mix of props from GenericContentFields and Exhibition
  // and is only what is required to render ExhibitionPromos and json-ld
  type: 'exhibitions';
  id: string;
  title: string;
  promo?: ImagePromo;
  format?: ExhibitionFormat;
  start: Date;
  end?: Date;
  isPermanent: boolean;
  statusOverride?: string;
  contributors: ContributorBasic[];
  labels: Label[];
  hideStatus?: boolean;
};

export type Exhibition = GenericContentFields & {
  shortTitle?: string;
  type: 'exhibitions';
  format?: ExhibitionFormat;
  start: Date;
  end?: Date;
  isPermanent: boolean;
  statusOverride?: string;
  bslInfo?: prismic.RichTextField;
  audioDescriptionInfo?: prismic.RichTextField;
  place?: Place;
  exhibits: Exhibit[];
  resources: Resource[];
  relatedIds: string[];
  seasons: Season[];
  contributors: Contributor[];
};

export type Exhibit = {
  item: Exhibition;
};

export type ExhibitionAbout = Book | Article | Series;

export type ExhibitionRelatedContent = {
  exhibitionOfs: (Exhibition | EventBasic)[];
  exhibitionAbouts: ExhibitionAbout[];
};
