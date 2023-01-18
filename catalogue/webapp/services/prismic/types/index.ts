import { Story } from './story';
import { Event } from './event';
import { Exhibition } from './exhibition';
import { ImageDimensions } from '@weco/common/model/image';

const contentTypes = [
  'articles',
  'books',
  'event-series',
  'events',
  'exhibitions',
  'guides',
  'pages',
  'projects',
  'seasons',
  'series',
  'webcomics',
  'guide-formats',
  'exhibition-guides',
  'stories-landing',
] as const;

export type ContentType = typeof contentTypes[number];

const querySchemaTypes = [
  'allEventss',
  'allExhibitionss',
  'allArticless',
  'allSeriess',
  'allWebcomicss',
] as const;

export type QuerySchemaType = typeof querySchemaTypes[number];

type BodyCopy = {
  [id: string]: {
    text: PrismicTitle[];
  };
};

type PrismicTitle = {
  type: string;
  text: string;
};

type TextObject = {
  text: string;
};

type Promo = {
  primary: {
    image: {
      url: string;
      dimensions: ImageDimensions;
      alt?: string;
      copyright?: string;
    };
    caption: TextObject[];
    link?: string;
  };
};

type Format = {
  __typename: string;
  _meta?: {
    id: string;
  };
};

export type Contributor = {
  contributor?: { name?: string };
};

export type PrismicResultsList<Result> = {
  type: 'ResultList';
  totalResults: number;
  totalPages: number;
  results: Result[];
  pageSize: number;
  prevPage: string | null;
  nextPage: string | null;
};

export type PrismicNodeItem = {
  title: PrismicTitle[];
  contributors: Contributor[];
  _meta: {
    id: string;
    firstPublicationDate: Date;
  };
  body: BodyCopy[];
  promo: Promo[];
  format: Format;
};

export type PrismicResponse = {
  node: PrismicNodeItem;
  cursor: string;
};

export type PrismicApiError = {
  errorType: string;
  httpStatus: number;
  label: string;
  description: string;
  type: 'Error';
};

export type TransformedResponse = Story | Event | Exhibition;
