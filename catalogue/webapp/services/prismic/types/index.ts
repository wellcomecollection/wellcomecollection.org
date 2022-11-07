import { Contributor } from '@weco/common/model/catalogue';
import { Story } from './story';
import { Event } from './event';
import { Exhibition } from './exhibition';

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

export type Standfirst = {
  caption: {
    text: string;
  }
};

export type Image = {
  url: string;
};

export type Promo = {
  primary: {
    caption: Standfirst;
    title: string;
    image: Image;
    description: string;
    link: {
      id: string;
      type: string;
    };
  };
};

export type PrismicApiError = {
  errorType: string;
  httpStatus: number;
  label: string;
  description: string;
  type: 'Error';
};

export type PrismicResultsList<Result> = {
  type: 'ResultList';
  totalResults: number;
  results: Result[];
};

export type PrismicNode = {
  node: PrismicNodeList[];
};

export type PrismicNodeList = {
  title: {
    text: string;
  };
  contributors: Contributor[];
  image: Image;
  type: string;
  _meta: {
    id: string;
    firstPublicationDate: Date;
  };
  body: Standfirst[];
  promo: Promo[];
};

export type PrismicResponse = {
  edges: PrismicNode[];
  node: PrismicNodeList;
};

export type TransformedResponse = Story | Event | Exhibition;
