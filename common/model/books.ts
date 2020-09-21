import { GenericContentFields } from './generic-content-fields';
import { HTMLString } from '../services/prismic/types';
import { ImageType } from './image';

type Review = {
  text: HTMLString;
  citation: HTMLString;
};

export type Book = GenericContentFields & {
  type: 'books';
  subtitle: string | null;
  orderLink: string | null;
  price: string | null;
  format: string | null;
  extent: string | null;
  isbn: string | null;
  reviews: (Review[]) | null;
  datePublished: Date | null;
  authorName: string | null; // This is structuredText in Prismic >.<
  authorImage: string | null; // This is a link in Prismic >.<
  authorDescription: HTMLString | null;
  cover: ImageType | null;
};
