// @flow
import type { Context } from 'next';
import { Component } from 'react';
import { getBooks } from '@weco/common/services/prismic/books';
// $FlowFixMe (tsx)
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import LayoutPaginatedResults from '@weco/common/views/components/LayoutPaginatedResults/LayoutPaginatedResults';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import type { Book } from '@weco/common/model/books';
import type { PaginatedResults } from '@weco/common/services/prismic/types';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
// $FlowFixMe
import { getGlobalContextData } from '@weco/common/views/components/GlobalContextProvider/GlobalContextProvider';

type Props = {|
  books: PaginatedResults<Book>,
  globalContextData: any,
|};

const pageDescription =
  'We publish thought-provoking books exploring health and human experiences.';
export class BooksPage extends Component<Props> {
  static getInitialProps = async (ctx: Context) => {
    const globalContextData = getGlobalContextData(ctx);
    const { page = 1, memoizedPrismic } = ctx.query;
    const books = await getBooks(ctx.req, { page }, memoizedPrismic);
    if (books) {
      return {
        books,
        title: 'Books',
        description: pageDescription,
        type: 'website',
        canonicalUrl: `https://wellcomecollection.org/books`,
        imageUrl: null,
        siteSection: 'books',
        analyticsCategory: 'books',
        globalContextData,
      };
    } else {
      return { statusCode: 404 };
    }
  };

  render() {
    const { globalContextData, books } = this.props;
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
        imageAltText={firstBook && firstBook.image && firstBook.image.alt}
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
  }
}

export default BooksPage;
