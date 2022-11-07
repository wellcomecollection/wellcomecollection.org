import { Contributor, Image } from '@weco/common/model/catalogue';
import { RichTextField } from '@prismicio/types';
import { ContentType } from './index';

export type Exhibition = {
  image: {
    url: string;
  };
  summary: Standfirst;
  id: string;
  contributors: Contributor[];
  firstPublicationDate: Date;
  title: Title;
  type: ContentType[];
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
