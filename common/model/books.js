// @flow
import type {GenericContentFields} from './generic-content-fields';
import type {HTMLString} from '../services/prismic/types';
import type {Image} from './image';

type Review = {|
  text: HTMLString,
  citation: HTMLString
|}

export type Book = {|
  ...GenericContentFields,
  type: 'books',
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
  cover: ?Image
|};
