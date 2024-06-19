import { ImagePromo } from './image-promo';
import { ImageType } from '@weco/common/model/image';
import { Label } from '@weco/common/model/labels';
import * as prismic from '@prismicio/client';
import { StandfirstSlice as RawStandfirstSlice } from '@weco/common/prismicio-types';

export type GenericContentFields = {
  id: string;
  title: string;
  promo?: ImagePromo;
  untransformedBody: prismic.Slice[];
  untransformedStandfirst?: RawStandfirstSlice;
  image?: ImageType;
  metadataDescription?: string;
  labels: Label[];
};
