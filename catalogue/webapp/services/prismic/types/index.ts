import { Contributor, Image } from '@weco/common/model/catalogue';
import { RichTextField, Slice } from '@prismicio/types';

export type Standfirst = Slice<
  'standfirst',
  {
    text: RichTextField;
  }
>;

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
  node: {
    title: string;
    contributors: Contributor[];
    image: Image[];
    type: string;
    _meta: {
      id: string;
      lastPublicationDate: string;
    };
    body: Standfirst[];
    promo: Promo[];
  };
};

export type PrismicResponse = {
  edges: PrismicNode[];
};
