import { ContentType } from './index';
import { RichTextField } from '@prismicio/types';

export type Story = {
  image: {
    url: string;
  };
  summary: Standfirst;
  id: string;
  contributors: string[];
  firstPublicationDate: Date;
  title: Title;
  type: ContentType[];
  label?: string | null;
};

export type Title = {
  text: {
    text: RichTextField;
  };
};

export type Standfirst = {
  caption: {
    text: string;
  };
};

// {
//   summary: any;
//   image: { url: any };
//   id: string;
//   contributors: Contributor[];
//   title: any;
//   lastPublicationDate: string;
//   type: any;
//   url: string
// }
