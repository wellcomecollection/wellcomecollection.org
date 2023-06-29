import { DigitalLocation, Contributor } from '@weco/common/model/catalogue';
import { ArticleAggregations } from './api';

export type { ArticleAggregations };

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
