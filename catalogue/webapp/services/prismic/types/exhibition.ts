import { Contributor, Image } from '@weco/common/model/catalogue';
import { RichTextField } from '@prismicio/types';
import { ContentType } from './index';

export type Exhibition = {
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
