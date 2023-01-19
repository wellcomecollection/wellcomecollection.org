import { ContentType } from './index';

export type Exhibition = {
  id: string;
  title: string;
  image: {
    url: string;
    width: number;
    height: number;
  };
  url: string;
  firstPublicationDate: Date;
  contributors: (string | undefined)[];
  type: ContentType[];
  summary: string;
  label: {
    text: string;
  };
};
