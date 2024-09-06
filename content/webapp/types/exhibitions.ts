import { Article } from './articles';
import { Series } from './series';
import { Book } from './books';
import { Contributor, ContributorBasic } from './contributors';
import { EventBasic } from './events';
import { Place } from './places';
import { GenericContentFields } from './generic-content-fields';
import { Link } from '@weco/content/types/link';
import { Season } from './seasons';
import { ImagePromo } from './image-promo';
import { ImageType } from '@weco/common/model/image';
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
  uid: string;
  title: string;
  promo?: ImagePromo;
  image?: ImageType;
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
  type: 'exhibitions';
  uid: string;
  shortTitle?: string;
  format?: ExhibitionFormat;
  start: Date;
  end?: Date;
  isPermanent: boolean;
  statusOverride?: string;
  place?: Place;
  exhibits: Exhibit[];
  relatedIds: string[];
  seasons: Season[];
  contributors: Contributor[];
  accessResourcesPdfs: AccessPDF[];
  accessResourcesText?: prismic.RichTextField;
};

export type Exhibit = {
  item: Exhibition;
};

export type ExhibitionAbout = Book | Article | Series;

export type ExhibitionRelatedContent = {
  exhibitionOfs: (Exhibition | EventBasic)[];
  exhibitionAbouts: ExhibitionAbout[];
};

export type AccessPDF = Link & { size: number };
