import { Book } from '../../../model/books';
import { BookPrismicDocument } from '../books';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function transformBook(document: BookPrismicDocument): Book {
  return {
    type: 'books',
  } as any as Book;
}
