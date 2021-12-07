import { fetcher } from '.';
import { BookPrismicDocument, booksFetchLinks } from '../types/books';

const fetchLinks = booksFetchLinks;

const booksFetcher = fetcher<BookPrismicDocument>('books', fetchLinks);

type FetchByType = Parameters<typeof booksFetcher.getByType>;
export const fetchBook = booksFetcher.getById;
export const fetchBooks = (
  client: FetchByType[0],
  params: FetchByType[1]
): ReturnType<typeof booksFetcher.getByType> => {
  return booksFetcher.getByType(client, {
    ...params,
    orderings: [
      { field: 'my.books.datePublished', direction: 'desc' },
      { field: 'document.first_publication_date desc' },
    ],
  });
};
export const fetchBooksClientSide = booksFetcher.getByTypeClientSide;
