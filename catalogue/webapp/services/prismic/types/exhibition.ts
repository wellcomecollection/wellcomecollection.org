import { Contributor, Image } from '@weco/common/model/catalogue';
import { RichTextField } from '@prismicio/types';

export type Exhibition = {
  image: {
    title: string;
    image: Image;
    description: string;
    link: { id: string; type: string };
  };
  standfirst: { text: RichTextField };
  id: string;
  contributors: Contributor[];
  lastPublicationDate: string;
  title: string;
  type: string;
};
