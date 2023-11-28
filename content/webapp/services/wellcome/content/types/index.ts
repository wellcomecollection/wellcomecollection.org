import { ImageDimensions } from '@weco/common/model/image';
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

export type ContentApiCroppedImage = {
  alt: string;
  copyright: string;
  url: string;
  dimensions: ImageDimensions;
};

export type ContentApiImage = {
  type: 'PrismicImage';
  alt: string;
  copyright: string;
  url: string;
  dimensions: ImageDimensions;
  square: ContentApiCroppedImage;
  '32:15': ContentApiCroppedImage;
  '16:9': ContentApiCroppedImage;
};
