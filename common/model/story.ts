import { Contributor, Image } from '@weco/common/model/catalogue';
import { Standfirst } from '@weco/content/services/prismic/types/body';

export type Story = {
  id: string;
  title: string;
  contributors: Contributor[];
  standfirst: Standfirst[];
  image: Image;
  type: string;
};

export type Promo = {
  primary: {
    title: string;
    image: Image;
    description: string;
    link: {
      id: string;
      type: string;
    };
  };
};

export type PrismicResponseNode = {
  _meta: {
    id: string;
  };
  title: string;
  description: string;
  body: Record<string, any>[];
  contributors: Contributor[];
  image: Image;
  promo: Promo;
  type: 'Story';
};

export type PrismicResponseNodeArray = {
  node: PrismicResponseNode;
};

export type PrismicResponseEdgeArray = {
  edges: PrismicResponseNodeArray[];
};

export type PrismicResponseStory = {
  data: PrismicResponseEdgeArray[];
  edges: PrismicResponseNodeArray[];
};

export type PrismicApiError = {
  errorType: string;
  httpStatus: number;
  label: string;
  description: string;
  type: 'Error';
};

export type StoryResultsList<Result> = {
  type: 'ResultList';
  totalResults: number;
  results: Result[];
};
