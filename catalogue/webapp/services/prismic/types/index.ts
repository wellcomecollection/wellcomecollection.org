import { ImageDimensions, ImageType } from '@weco/common/model/image';

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
      alt: string | null;
      copyright: string | null;
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

export type Story = {
  type: 'articles';
  id: string;
  title: string;
  image?: ImageType;
  url: string;
  firstPublicationDate: Date;
  contributors: (string | undefined)[];
  summary?: string;
  label: {
    text: string;
  };
};
