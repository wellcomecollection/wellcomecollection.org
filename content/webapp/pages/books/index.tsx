import type { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import { getServerData } from '@weco/common/server-data';
import { SimplifiedServerData } from '@weco/common/server-data/types';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchBooks } from '@weco/content/services/prismic/fetch/books';
import {
  transformBook,
  transformBookToBookBasic,
} from '@weco/content/services/prismic/transformers/books';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';
import { getPage } from '@weco/content/utils/query-params';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import BooksPage, { Props as BooksPageProps } from '@weco/content/views/books';

type Props = BooksPageProps & {
  serverData: SimplifiedServerData; // TODO should we enforce this?
};

const Page: FunctionComponent<Props> = (props: BooksPageProps) => {
  return <BooksPage {...props} />;
};

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async context => {
  setCacheControl(context.res);
  const page = getPage(context.query);

  if (typeof page !== 'number') {
    return appError(context, 400, page.message);
  }

  const client = createClient(context);
  const booksQuery = await fetchBooks(client, {
    page,
    pageSize: 21,
  });

  const books = transformQuery(booksQuery, book =>
    transformBookToBookBasic(transformBook(book))
  );

  const serverData = await getServerData(context);

  return {
    props: serialiseProps<Props>({
      books,
      serverData,
    }),
  };
};

export default Page;
