import { ImageType } from '@weco/common/model/image';
import { ContentType } from './index';

export type Exhibition = {
  id: string;
  title: string;
  image?: ImageType;
  url: string;
  firstPublicationDate: Date;
  contributors: (string | undefined)[];
  type: ContentType[];
  summary?: string;
  label: {
    text: string;
  };
};
