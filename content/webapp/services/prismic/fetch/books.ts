import { fetcher } from '.';
import { BookPrismicDocument, booksFetchLinks } from '../types/books';

const fetchLinks = booksFetchLinks;

const booksFetcher = fetcher<BookPrismicDocument>('books', fetchLinks);

export const fetchBook = booksFetcher.getById;
export const fetchBooks = booksFetcher.getByType;
export const fetchBooksClientSide = booksFetcher.getByTypeClientSide;
