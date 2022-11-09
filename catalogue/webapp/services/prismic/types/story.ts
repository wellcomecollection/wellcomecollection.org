import { ContentType } from './index';
import { RichTextField } from '@prismicio/types';

export type Story = {
  id: string;
  title: Title;
  image: {
    url: string;
  };
  url: string;
  firstPublicationDate: Date;
  contributors: string[];
  type: ContentType[];
  summary: Standfirst;
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
