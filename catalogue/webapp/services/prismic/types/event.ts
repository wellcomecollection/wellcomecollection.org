import { Contributor, Image } from '@weco/common/model/catalogue';
import { RichTextField } from '@prismicio/types';
import { ContentType } from './index';

export type Event = {
  image: {
    title: string;
    image: Image;
    description: string;
    link: { id: string; type: string };
  };
  standfirst: { text: RichTextField };
  id: string;
  contributors: Contributor[];
  lastPublicationDate: Date;
  title: string;
  type: ContentType[];
};
