import { DigitalLocation, Contributor } from '@weco/common/model/catalogue';
import { Story } from '@weco/catalogue/services/prismic/types';
import { Content, ContentApiProps } from './api';

export type { ContentApiProps };

// Response objects
export type ContentApiError = {
  errorType: string;
  httpStatus: number;
  label: string;
  description: string;
  type: 'Error';
};

export type Image = {
  type: 'Image';
  id: string;
  locations: DigitalLocation[];
  source: {
    id: string;
    title: string;
    contributors?: Contributor[];
    type: string;
  };
  visuallySimilar?: Image[];
  aspectRatio?: number;
};

export type ResultType = Story | Content;

export type ContentResultsList<Result extends ResultType> = {
  type: 'ResultList';
  totalResults: number;
  totalPages: number;
  results: Result[];
  pageSize: number;
  prevPage: string | null;
  nextPage: string | null;

  // We include the URL used to fetch data from the content API for
  // debugging purposes.
  _requestUrl: string;
};
