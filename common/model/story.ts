import { Contributor, Image } from '@weco/common/model/catalogue';

export type Story = {
  id: string;
  title: string;
  description: string;
  body: string;
  contributors: Contributor[];
  image: Image;
  type: 'Story';
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

export type ArticleNode = {
  id: string;
  title: string;
  description: string;
  body: Record<any, any>;
  contributors: Contributor[];
  image: Image;
  promo: Promo;
  type: 'Story';
};

export type ArticleNodeArray = {
  node: ArticleNode;
};

export type PrismicResponseStory = {
  edges: ArticleNodeArray[];
};

export type PrismicApiError = {
  errorType: string;
  httpStatus: number;
  label: string;
  description: string;
  type: 'Error';
};

export type ResultType = Story | PrismicResponseStory;

export type StoryResultsList<Result extends ResultType> = {
  type: 'ResultList';
  totalResults: number;
  totalPages: number;
  results: Result[];
  pageSize: number;
  prevPage: string | null;
  nextPage: string | null;
};
