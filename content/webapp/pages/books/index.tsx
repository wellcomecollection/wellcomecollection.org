import type { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import { pageDescriptions } from '@weco/common/data/microcopy';
import { getServerData } from '@weco/common/server-data';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import { serialiseProps } from '@weco/common/utils/json';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import LayoutPaginatedResults from '@weco/content/components/LayoutPaginatedResults/LayoutPaginatedResults';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchBooks } from '@weco/content/services/prismic/fetch/books';
import {
  transformBook,
  transformBookToBookBasic,
} from '@weco/content/services/prismic/transformers/books';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';
import { BookBasic } from '@weco/content/types/books';
import { getPage } from '@weco/content/utils/query-params';
import { setCacheControl } from '@weco/content/utils/setCacheControl';

type Props = {
  books: PaginatedResults<BookBasic>;
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
    props: serialiseProps({
      books,
      serverData,
    }),
  };
};

const BooksPage: FunctionComponent<Props> = ({ books }) => {
  const firstBook = books.results[0];

  return (
    <PageLayout
      title="Books"
      description={pageDescriptions.books}
      url={{ pathname: '/books' }}
      jsonLd={{ '@type': 'WebPage' }}
      openGraphType="website"
      siteSection="stories"
      image={firstBook && firstBook.cover}
    >
      <SpacingSection>
        <LayoutPaginatedResults
          title="Books"
          description={pageDescriptions.books}
          paginatedResults={books}
          breadcrumbs={{
            items: [
              {
                text: 'Stories',
                url: '/stories/',
              },
            ],
          }}
        />
      </SpacingSection>
    </PageLayout>
  );
};

export default BooksPage;
