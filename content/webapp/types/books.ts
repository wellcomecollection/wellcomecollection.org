import { GenericContentFields } from './generic-content-fields';
import { ImageType } from '@weco/common/model/image';
import * as prismic from '@prismicio/client';
import { Contributor } from './contributors';
import { Season } from './seasons';
import { ImagePromo } from './image-promo';
import { Label } from '@weco/common/model/labels';

type Review = {
  text: prismic.RichTextField;
  citation: prismic.RichTextField;
};

export type BookBasic = {
  // this is a mix of props from GenericContentFields and Book
  // and is only what is required to render BookPromos and json-ld
  type: 'books';
  id: string;
  title: string;
  subtitle?: string;
  cover?: ImageType;
  promo?: ImagePromo | undefined;
  labels: Label[];
};

export type Book = GenericContentFields & {
  type: 'books';
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
