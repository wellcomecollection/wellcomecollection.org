import { ImagePromo } from './image-promo';
import { ImageType } from '@weco/common/model/image';
import { Label } from '@weco/common/model/labels';
import * as prismic from '@prismicio/client';
import { BodySlice } from './body';
import { StandfirstSlice } from '@weco/common/prismicio-types';

export type GenericContentFields = {
  id: string;
  title: string;
  promo?: ImagePromo;
  body: BodySlice[];
  untransformedBody: prismic.Slice[];
  standfirst?: prismic.RichTextField;
  untransformedStandfirst?: StandfirstSlice;
  image?: ImageType;
  metadataDescription?: string;
  labels: Label[];
};
