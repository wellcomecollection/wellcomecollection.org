import * as prismic from '@prismicio/client';
import { ImageType } from '@weco/common/model/image';

export type MediaObjectType = {
  title: string | null;
  text: prismic.RichTextField | null;
  image: ImageType | null;
};
