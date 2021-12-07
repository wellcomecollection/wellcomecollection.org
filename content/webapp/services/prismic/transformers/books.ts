import { parseBook } from '@weco/common/services/prismic/books';
import { Book as DeprecatedBook } from '@weco/common/model/books';
import { Book } from '../../../types/books';
import { BookPrismicDocument } from '../types/books';
import { transformKeyTextField, transformRichTextFieldToString } from '.';
import { isFilledLinkToWebField } from '../types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function transformBook(document: BookPrismicDocument): Book {
  const { data } = document;
  const book: DeprecatedBook = parseBook(document);

  return {
    ...book,
    subtitle: transformRichTextFieldToString(data.subtitle),
    orderLink: isFilledLinkToWebField(data.orderLink)
      ? data.orderLink.url
      : undefined,
    price: transformKeyTextField(data.price),
    format: transformKeyTextField(data.format),
    extent: transformKeyTextField(data.extent),
    isbn: transformKeyTextField(data.isbn),
    prismicDocument: document,
  };
}
