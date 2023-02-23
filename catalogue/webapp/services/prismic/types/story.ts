import { ImageType } from '@weco/common/model/image';
import { ContentType } from './index';

export type Story = {
  id: string;
  title: string;
  image?: ImageType;
  url: string;
  firstPublicationDate: Date;
  contributors: (string | undefined)[];
  type: ContentType[];
  format: string;
  summary?: string;
};
