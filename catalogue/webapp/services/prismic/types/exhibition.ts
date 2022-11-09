import { Contributor, Image } from '@weco/common/model/catalogue';
import { RichTextField } from '@prismicio/types';
import { ContentType } from './index';

export type Exhibition = {
  image: {
    url: string;
  };
  url: string;
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
