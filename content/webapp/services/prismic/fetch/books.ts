import * as prismic from '@prismicio/client';
import { fetcher, GetServerSidePropsPrismicClient, GetByTypeParams } from '.';
import { commonPrismicFieldsFetchLinks, contributorFetchLinks } from '../types';
import { BookPrismicDocument } from '../types/books';
import { eventsFetchLinks } from '../types/events';

const fetchLinks = [
  ...commonPrismicFieldsFetchLinks,
  ...contributorFetchLinks,
  ...eventsFetchLinks,
];

const booksFetcher = fetcher<BookPrismicDocument>('books', fetchLinks);

export const fetchBook = booksFetcher.getById;

export const fetchBooks = (
  client: GetServerSidePropsPrismicClient,
  params: GetByTypeParams
): Promise<prismic.Query<BookPrismicDocument>> => {
  return booksFetcher.getByType(client, {
    ...params,
    orderings: [
      { field: 'my.books.datePublished', direction: 'desc' },
      { field: 'document.first_publication_date', direction: 'desc' },
    ],
  });
};
