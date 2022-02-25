import { ImagePromo } from './image-promo';
import { Picture } from './picture';
import { ImageType } from './image';
import { Label } from './labels';
import { HTMLString } from '../services/prismic/types';

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
  standfirst?: HTMLString;
  promoText?: string;
  promoImage?: Picture;
  image?: ImageType;
  squareImage?: ImageType;
  widescreenImage?: ImageType;
  superWidescreenImage?: ImageType;
  metadataDescription?: string;
  labels: Label[];
};
