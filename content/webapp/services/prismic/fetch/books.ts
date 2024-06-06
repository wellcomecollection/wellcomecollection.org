import * as prismic from '@prismicio/client';
import { fetcher, GetServerSidePropsPrismicClient, GetByTypeParams } from '.';
import { commonPrismicFieldsFetchLinks, contributorFetchLinks } from '../types';
import { eventsFetchLinks } from '../types/events';
import { BooksDocument } from '@weco/common/prismicio-types';

const fetchLinks = [
  ...commonPrismicFieldsFetchLinks,
  ...contributorFetchLinks,
  ...eventsFetchLinks,
];

const booksFetcher = fetcher<BooksDocument>('books', fetchLinks);

export const fetchBook = booksFetcher.getById;

export const fetchBooks = (
  client: GetServerSidePropsPrismicClient,
  params: GetByTypeParams
): Promise<prismic.Query<BooksDocument>> => {
  return booksFetcher.getByType(client, {
    ...params,
    orderings: [
      { field: 'my.books.datePublished', direction: 'desc' },
      { field: 'document.first_publication_date', direction: 'desc' },
    ],
  });
};
