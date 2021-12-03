import { Book as DeprecatedBook } from '@weco/common/model/books';
import { Override } from '@weco/common/utils/utility-types';
import { BookPrismicDocument } from '../services/prismic/books';

export type Book = Override<
  DeprecatedBook,
  {
    subtitle?: string | undefined;
    orderLink?: string | undefined;
    price?: string | undefined;
    format?: string | undefined;
    extent?: string | undefined;
    isbn?: string | undefined;
    prismicDocument: BookPrismicDocument;
  }
>;
