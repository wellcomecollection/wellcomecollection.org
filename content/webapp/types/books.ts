import * as prismic from '@prismicio/client';

import { ImageType } from '@weco/common/model/image';
import { Label } from '@weco/common/model/labels';

import { Contributor } from './contributors';
import { GenericContentFields } from './generic-content-fields';
import { ImagePromo } from './image-promo';
import { Season } from './seasons';

type Review = {
  text: prismic.RichTextField;
  citation: prismic.RichTextField;
};

export type BookBasic = {
  // this is a mix of props from GenericContentFields and Book
  // and is only what is required to render BookCards and json-ld
  type: 'books';
  id: string;
  uid: string;
  title: string;
  subtitle?: string;
  cover?: ImageType;
  promo?: ImagePromo | undefined;
  labels: Label[];
  meta?: string; // TODO contrib, date
};

export type Book = GenericContentFields & {
  type: 'books';
  uid: string;
  subtitle?: string;
  orderLink?: string;
  price?: string;
  format?: string;
  extent?: string;
  isbn?: string;
  reviews?: Review[];
  datePublished?: Date;
  cover?: ImageType;
  seasons: Season[];
  contributors: Contributor[];
};
