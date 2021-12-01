// @flow
import type { GenericContentFields } from './generic-content-fields';
import type { HTMLString } from '../services/prismic/types';
import type { ImageType } from './image';
import type { Season } from './seasons';
type Review = {|
  text: HTMLString,
  citation: HTMLString,
|};

export type Book = {|
  ...GenericContentFields,
  type: 'books',
  subtitle: ?string,
  orderLink: ?string,
  price: ?string,
  format: ?string,
  extent: ?string,
  isbn: ?string,
  reviews: ?(Review[]),
  datePublished: ?Date,
  cover: ?ImageType,
  seasons: Season[],
  prismicDocument: any,
|};
