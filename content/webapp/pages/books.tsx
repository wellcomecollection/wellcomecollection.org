import type { GetServerSideProps } from 'next';
import { getBooks } from '@weco/common/services/prismic/books';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import LayoutPaginatedResults from '@weco/common/views/components/LayoutPaginatedResults/LayoutPaginatedResults';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import { Book } from '@weco/common/model/books';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import {
  getGlobalContextData,
  WithGlobalContextData,
} from '@weco/common/views/components/GlobalContextProvider/GlobalContextProvider';
import { AppErrorProps } from '@weco/common/views/pages/_app';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { FC } from 'react';
import { getServerData } from '@weco/common/server-data';

type Props = {
  books: PaginatedResults<Book>;
} & WithGlobalContextData;

const pageDescription =
  'We publish thought-provoking books exploring health and human experiences.';

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = getServerData(context);
    const globalContextData = getGlobalContextData(context);
    const { page = 1, memoizedPrismic } = context.query;
    const books = await getBooks(context.req, { page }, memoizedPrismic);
    if (books) {
      return {
        props: removeUndefinedProps({
          books,
          globalContextData,
          serverData,
        }),
      };
    } else {
      return { notFound: true };
    }
  };
const BooksPage: FC<Props> = props => {
  const { globalContextData, books } = props;
  const firstBook = books.results[0];

  return (
    <PageLayout
      title={'Books'}
      description={pageDescription}
      url={{ pathname: `/books` }}
      jsonLd={{ '@type': 'WebPage' }}
      openGraphType={'website'}
      siteSection={null}
      imageUrl={
        firstBook &&
        firstBook.image &&
        convertImageUri(firstBook.image.contentUrl, 800)
      }
      imageAltText={
        (firstBook && firstBook.image && firstBook.image.alt) ?? undefined
      }
      globalContextData={globalContextData}
    >
      <SpacingSection>
        <LayoutPaginatedResults
          showFreeAdmissionMessage={false}
          title={'Books'}
          description={[
            {
              type: 'paragraph',
              text: pageDescription,
              spans: [],
            },
          ]}
          paginatedResults={books}
          paginationRoot={'books'}
        />
      </SpacingSection>
    </PageLayout>
  );
};

export default BooksPage;
