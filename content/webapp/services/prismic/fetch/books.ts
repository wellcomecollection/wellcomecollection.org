import * as prismic from '@prismicio/client';

import { BooksDocument as RawBooksDocument } from '@weco/common/prismicio-types';
import {
  commonPrismicFieldsFetchLinks,
  contributorFetchLinks,
  eventsFetchLinks,
} from '@weco/content/services/prismic/types';

import { fetcher, GetByTypeParams, GetServerSidePropsPrismicClient } from '.';

const fetchLinks = [
  ...commonPrismicFieldsFetchLinks,
  ...contributorFetchLinks,
  ...eventsFetchLinks,
];

const booksFetcher = fetcher<RawBooksDocument>('books', fetchLinks);

export const fetchBook = async (
  client: GetServerSidePropsPrismicClient,
  id: string
): Promise<RawBooksDocument | undefined> => {
  const bookDocument =
    (await booksFetcher.getByUid(client, id)) ||
    (await booksFetcher.getById(client, id));
  return bookDocument;
};

export const fetchBooks = (
  client: GetServerSidePropsPrismicClient,
  params: GetByTypeParams = {}
): Promise<prismic.Query<RawBooksDocument>> => {
  return booksFetcher.getByType(client, {
    ...params,
    orderings: [
      { field: 'my.books.datePublished', direction: 'desc' },
      { field: 'document.first_publication_date', direction: 'desc' },
    ],
  });
};
