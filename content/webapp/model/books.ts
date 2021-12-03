import { RichTextField } from '@prismicio/types';
import { Image } from '../services/prismic/types';
import { BookPrismicDocument } from '../services/prismic/books';
import { CommonFields } from './common-fields';

type Review = {
  text: RichTextField;
  citation: RichTextField;
};
type Season = {
  title?: string;
};
export type Book = CommonFields & {
  type: 'books';
  subtitle?: string;
  orderLink?: string;
  price?: string;
  format?: string;
  extent?: string;
  isbn?: string;
  reviews: Review[];
  datePublished?: Date;
  cover?: Image;
  seasons: Season[];
  prismicDocument: BookPrismicDocument;
};
