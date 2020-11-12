import { Contributor } from './contributors';
import { ImagePromo } from './image-promo';
import { Picture } from './picture';
import { ImageType } from './image';
import { Label } from './labels';
import { HTMLString } from '../services/prismic/types';

export type Body = Record<string, unknown>[];

// TODO: we need to get type in here to be able to union on these
// i.e. search results
export type GenericContentFields = {
  id: string;
  title: string;
  contributorsTitle: string | null;
  contributors: Contributor[];
  promo: ImagePromo | null;
  body: Body;
  standfirst: HTMLString | null;
  promoText: string | null;
  promoImage: Picture | null;
  image: ImageType | null;
  squareImage: ImageType | null;
  widescreenImage: ImageType | null;
  metadataDescription: string | null;
  labels: Label[];
};
