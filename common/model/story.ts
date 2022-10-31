import { Contributor, Image } from '@weco/common/model/catalogue';
import { RichTextField, Slice } from '@prismicio/types';

export type Story = {
  id: string;
  title: string;
  lastPublicationDate: string;
  contributors: Contributor[];
  standfirst: Standfirst[];
  image: Image[];
  type: string;
};

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

export type PrismicResponseEdgeArray = {
  edges: [PrismicNode[]];
};

export type PrismicResponseStory = {
  data: {
    allArticless: PrismicResponseEdgeArray;
  };
};

export type PrismicAllArticles = {
  allArticless: PrismicResponseEdgeArray[];
};

export type PrismicNode = {
  title: string;
  contributors: Contributor[];
  standfirst: Standfirst[];
  image: Image[];
  type: string;
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
