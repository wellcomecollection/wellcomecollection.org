import * as prismicT from '@prismicio/types';
import { ImageType } from '@weco/common/model/image';

export type MediaObjectType = {
  title: string | null;
  text: prismicT.RichTextField | null;
  image: ImageType | null;
};
