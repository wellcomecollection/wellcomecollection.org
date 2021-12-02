import { fetcher } from '.';
import { BookPrismicDocument } from '../books';

const fetchLinks = [];

const booksFetcher = fetcher<BookPrismicDocument>('books', fetchLinks);

export const fetchBook = booksFetcher.getById;
export const fetchBooks = booksFetcher.getByType;
export const fetchBooksClientSide = booksFetcher.getByTypeClientSide;
