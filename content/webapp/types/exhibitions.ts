import * as prismic from '@prismicio/client';

import { ImageType } from '@weco/common/model/image';
import { Label } from '@weco/common/model/labels';
import { Props as VideoEmbedProps } from '@weco/common/views/components/VideoEmbed';
import { Link } from '@weco/content/types/link';

import { Article } from './articles';
import { Book } from './books';
import { Contributor, ContributorBasic } from './contributors';
import { EventBasic } from './events';
import { GenericContentFields } from './generic-content-fields';
import { ImagePromo } from './image-promo';
import { Place } from './places';
import { Season } from './seasons';
import { Series } from './series';

// e.g. 'Permanent'
export type ExhibitionFormat = {
  id: string;
  title: string;
  description?: string;
};

export type ExhibitionBasic = {
  // this is a mix of props from GenericContentFields and Exhibition
  // and is only what is required to render ExhibitionCards and json-ld
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
  bslLeafletVideo?: VideoEmbedProps & { title?: string };
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
