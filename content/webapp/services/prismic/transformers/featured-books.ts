import { isNotUndefined } from '@weco/common/utils/array';
import { FeaturedBooksPrismicDocument } from '../types/books';
import { transformBook } from '../transformers/books';
import { isFilledLinkToDocumentWithData } from '@weco/common/services/prismic/types';
import { Book } from '../../../types/books';

export function transformFeaturedBooks(
  featuredBooksDoc: FeaturedBooksPrismicDocument
): Book[] {
  return featuredBooksDoc.data.books
    .map(d =>
      isFilledLinkToDocumentWithData(d.book) ? transformBook(d.book) : undefined
    )
    .filter(isNotUndefined);
}
