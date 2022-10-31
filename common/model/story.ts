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

export type PrismicResponseNode = {
  _meta: {
    id: string;
    lastPublicationDate: string;
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
  allArticless: PrismicResponseEdgeArray[];
  data: PrismicResponseEdgeArray[];
  edges: PrismicResponseNodeArray[];
};

export type StoryResultsList<Result> = {
  type: 'ResultList';
  totalResults: number;
  results: Result[];
};
