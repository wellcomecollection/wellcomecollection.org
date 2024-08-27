import * as prismic from '@prismicio/client';
import { fetcher, GetServerSidePropsPrismicClient, GetByTypeParams } from '.';
import {
  commonPrismicFieldsFetchLinks,
  contributorFetchLinks,
  eventsFetchLinks,
} from '@weco/content/services/prismic/types';
import { BooksDocument as RawBooksDocument } from '@weco/common/prismicio-types';

const fetchLinks = [
  ...commonPrismicFieldsFetchLinks,
  ...contributorFetchLinks,
  ...eventsFetchLinks,
];

const booksFetcher = fetcher<RawBooksDocument>('books', fetchLinks);

export const fetchBook = booksFetcher.getById;

export const fetchBookDocumentByUID = ({
  client,
  uid,
}: {
  client: GetServerSidePropsPrismicClient;
  uid: string;
}) => fetcher<RawBooksDocument>('books', fetchLinks).getByUid(client, uid);

export const fetchBooks = (
  client: GetServerSidePropsPrismicClient,
  params: GetByTypeParams
): Promise<prismic.Query<RawBooksDocument>> => {
  return booksFetcher.getByType(client, {
    ...params,
    orderings: [
      { field: 'my.books.datePublished', direction: 'desc' },
      { field: 'document.first_publication_date', direction: 'desc' },
    ],
  });
};
