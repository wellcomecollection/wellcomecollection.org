import { GenericContentFields } from './generic-content-fields';
import { HTMLString } from '../services/prismic/types';
import { ImageType } from './image';
import { Season } from './seasons';

type Review = {
  text: HTMLString;
  citation: HTMLString;
};

export type Book = GenericContentFields & {
  type: 'books';
  subtitle?: string;
  orderLink?: string;
  price?: string;
  format?: string;
  extent?: string;
  isbn?: string;
  reviews: Review[] | null;
  datePublished: Date | null;
  cover: ImageType | null;
  seasons: Season[];
};
