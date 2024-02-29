import { ImagePromo } from './image-promo';
import { ImageType } from '@weco/common/model/image';
import { Label } from '@weco/common/model/labels';
import * as prismic from '@prismicio/client';
import { BodySlice } from './body';

export type GenericContentFields = {
  id: string;
  title: string;
  promo?: ImagePromo;
  body: BodySlice[];
  originalBody: prismic.Slice[];
  standfirst?: prismic.RichTextField;
  image?: ImageType;
  metadataDescription?: string;
  labels: Label[];
};
