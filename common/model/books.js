// @flow
import type {HTMLString} from '../services/prismic/types';
import type {ImagePromo} from './image-promo';

type Review = {|
  text: HTMLString,
  citation: HTMLString
|}

export type Book = {|
  id: string,
  title: ?string,
  subtitle: ?string,
  orderLink: ?string,
  price: ?string,
  format: ?string,
  extent: ?string,
  isbn: ?string,
  reviews: ?Review[],
  datePublished: ?Date,
  authorName: ?string, // This is structuredText in Prismic >.<
  authorImage: ?string, // This is a link in Prismic >.<
  authorDescription: ?HTMLString,
  body: ?any[],
  promo: ?ImagePromo
|};
