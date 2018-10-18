// @flow
import {Component} from 'react';
import {getBooks} from '@weco/common/services/prismic/books';
import PageWrapper from '@weco/common/views/components/PageWrapper/PageWrapper';
import LayoutPaginatedResults from '@weco/common/views/components/LayoutPaginatedResults/LayoutPaginatedResults';
import type {GetInitialPropsProps} from '@weco/common/views/components/PageWrapper/PageWrapper';
import type {Book} from '@weco/common/model/books';
import type {PaginatedResults} from '@weco/common/services/prismic/types';

type Props = {|
  books: PaginatedResults<Book>
|}

const pageDescription = 'Wellcome Collection publishes books that relate to our exhibitions, collections and areas of interest.';
export class BooksListPage extends Component<Props> {
  static getInitialProps = async (context: GetInitialPropsProps) => {
    const {page = 1} = context.query;
    const books = await getBooks(context.req, {page});
    if (books) {
      return {
        books,
        title: 'Books',
        description: pageDescription,
        type: 'website',
        canonicalUrl: `https://wellcomecollection.org/books`,
        imageUrl: null,
        siteSection: 'books',
        analyticsCategory: 'books'
      };
    } else {
      return {statusCode: 404};
    }
  }

  render() {
    const {books} = this.props;

    return (
      <LayoutPaginatedResults
        title={'Books'}
        description={[{
          type: 'paragraph',
          text: pageDescription,
          spans: []
        }]}
        paginatedResults={books}
        paginationRoot={'books'}
      />
    );
  }
};

export default PageWrapper(BooksListPage);
