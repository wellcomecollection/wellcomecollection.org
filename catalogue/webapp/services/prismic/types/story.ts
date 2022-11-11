import { Contributor } from '@weco/common/model/catalogue';
import { ContentType } from './index';
import { RichTextField } from '@prismicio/types';

export type Story = {
  image: {
    url: string;
  };
  summary: Standfirst[];
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
  text: {
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
