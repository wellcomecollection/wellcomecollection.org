// @flow
import type { Context } from 'next';
import { Component } from 'react';
import { getBooks } from '@weco/common/services/prismic/books';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import LayoutPaginatedResults from '@weco/common/views/components/LayoutPaginatedResults/LayoutPaginatedResults';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import type { Book } from '@weco/common/model/books';
import type { PaginatedResults } from '@weco/common/services/prismic/types';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';

type Props = {|
  books: PaginatedResults<Book>,
|};

const pageDescription =
  'Wellcome Collection publishes adventurous and unusual books that explore health, medicine and the complexities of the human condition.';
export class BooksPage extends Component<Props> {
  static getInitialProps = async (ctx: Context) => {
    const { page = 1 } = ctx.query;
    const books = await getBooks(ctx.req, { page });
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
      };
    } else {
      return { statusCode: 404 };
    }
  };

  render() {
    const { books } = this.props;
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
