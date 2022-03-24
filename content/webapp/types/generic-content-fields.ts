import { ImagePromo } from './image-promo';
import { ImageType } from '@weco/common/model/image';
import { Label } from '@weco/common/model/labels';
import * as prismicT from '@prismicio/types';

export type Weight = 'default' | 'featured' | 'standalone' | 'supporting';

type BodySlice = {
  type: string;
  weight?: Weight;
  // TODO: Sync up types with the body slices and the components they return
  value: any;
};

export type BodyType = BodySlice[];

export type GenericContentFields = {
  id: string;
  title: string;
  promo?: ImagePromo;
  body: BodyType;
  standfirst?: prismicT.RichTextField;
  image?: ImageType;
  metadataDescription?: string;
  labels: Label[];
};
