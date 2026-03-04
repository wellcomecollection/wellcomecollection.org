import * as prismic from '@prismicio/client';

import { ImageType } from '@weco/common/model/image';
import { Label } from '@weco/common/model/labels';
import { PagesDocumentDataBodySlice } from '@weco/common/prismicio-types';
import { StandfirstSlice as RawStandfirstSlice } from '@weco/common/prismicio-types';

import { ImagePromo } from './image-promo';

export type GenericContentFields = {
  id: string;
  title: string;
  promo?: ImagePromo;
  untransformedBody: prismic.SliceZone<PagesDocumentDataBodySlice>;
  untransformedStandfirst?: RawStandfirstSlice;
  image?: ImageType;
  metadataDescription?: string;
  labels: Label[];
};
