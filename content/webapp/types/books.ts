import { Book as DeprecatedBook } from '@weco/common/model/books';
import { Override } from '@weco/common/utils/utility-types';
import { BookPrismicDocument } from '../services/prismic/types/books';
import { Contributor } from './contributors';

export type Book = Override<
  DeprecatedBook,
  {
    subtitle?: string;
    orderLink?: string;
    price?: string;
    format?: string;
    extent?: string;
    isbn?: string;
    contributors: Contributor[];
    prismicDocument?: BookPrismicDocument;
  }
>;
