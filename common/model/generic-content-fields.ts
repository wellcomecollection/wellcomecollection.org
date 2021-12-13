import { ImagePromo } from './image-promo';
import { Picture } from './picture';
import { ImageType } from './image';
import { Label } from './labels';
import { HTMLString } from '../services/prismic/types';
import { Weight } from '../services/prismic/parsers';

type BodySlice = {
  type: string;
  weight?: Weight;
  // TODO: Sync up types with the body slices and the components they return
  value: any;
};

export type BodyType = BodySlice[];

// TODO: we need to get type in here to be able to union on these
// i.e. search results
// TODO: These 'null's should be optional values.
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
  metadataDescription: string;
  labels: Label[];
};
