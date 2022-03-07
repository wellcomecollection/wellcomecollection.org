import { HTMLString } from '@weco/common/services/prismic/types';
import { ImageType } from '@weco/common/model/image';

export type MediaObjectType = {
  title: string | null;
  text: HTMLString | null;
  image: ImageType | null;
};
