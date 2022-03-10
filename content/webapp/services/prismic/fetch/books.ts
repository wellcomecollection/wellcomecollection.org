import { Query } from '@prismicio/types';
import { fetcher, GetServerSidePropsPrismicClient, GetByTypeParams } from '.';
import { BookPrismicDocument, booksFetchLinks } from '../types/books';

const fetchLinks = booksFetchLinks;

const booksFetcher = fetcher<BookPrismicDocument>('books', fetchLinks);

export const fetchBook = booksFetcher.getById;

export const fetchBooks = (
  client: GetServerSidePropsPrismicClient,
  params: GetByTypeParams
): Promise<Query<BookPrismicDocument>> => {
  return booksFetcher.getByType(client, {
    ...params,
    orderings: [
      { field: 'my.books.datePublished', direction: 'desc' },
      { field: 'document.first_publication_date', direction: 'desc' },
    ],
  });
};
