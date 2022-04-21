import { ImagePromo } from './image-promo';
import { ImageType } from '@weco/common/model/image';
import { Label } from '@weco/common/model/labels';
import * as prismicT from '@prismicio/types';
import { BodySlice } from './body';

export type GenericContentFields = {
  id: string;
  title: string;
  promo?: ImagePromo;
  body: BodySlice[];
  standfirst?: prismicT.RichTextField;
  image?: ImageType;
  metadataDescription?: string;
  labels: Label[];
};
