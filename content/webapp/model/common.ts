import { Image } from '../services/prismic/types';
import { Contributor } from './contributors';
import { Body } from '../services/prismic/body';

export type CommonFields = {
  id: string;
  title: string;
  contributorsTitle: string | null;
  contributors: Contributor[];
  body: Body;
  promoText?: string;
  promoImage?: Image;
  image?: Image;
  squareImage?: Image;
  widescreenImage?: Image;
  superWidescreenImage?: Image;
  metadataDescription?: string;
};
