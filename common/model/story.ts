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

export type PrismicResponseStory = {
  data: {
    title: string;
    description: string;
    Story: Story;
  };
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
