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
