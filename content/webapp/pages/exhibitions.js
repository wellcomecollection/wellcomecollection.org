// @flow
import {Component} from 'react';
import {getExhibitions} from '@weco/common/services/prismic/exhibitions';
import PageWrapper from '@weco/common/views/components/PageWrapper/PageWrapper';
import LayoutPaginatedResults from '@weco/common/views/components/LayoutPaginatedResults/LayoutPaginatedResults';
import type {GetInitialPropsProps} from '@weco/common/views/components/PageWrapper/PageWrapper';
import type {UiExhibition} from '@weco/common/model/exhibitions';
import type {Period} from '@weco/common/model/periods';
import type {PaginatedResults} from '@weco/common/services/prismic/types';

type Props = {|
  exhibitions: PaginatedResults<UiExhibition>,
  period: ?Period,
  displayTitle: string
|}

const pageDescription = 'Explore the connections between science, medicine, life and art through our permanent and temporary exhibitions. Admission is always free.';
export class ExhibitionsListPage extends Component<Props> {
  static getInitialProps = async (context: GetInitialPropsProps) => {
    const {page = 1} = context.query;
    const {period} = context.query;
    const exhibitions = await getExhibitions(context.req, {page, period});
    if (exhibitions) {
      const title = (period === 'past' ? 'Past e' : 'E') + 'xhibitions';
      return {
        exhibitions,
        title,
        displayTitle: title,
        period,
        description: pageDescription,
        type: 'website',
        canonicalUrl: `https://wellcomecollection.org/exhibitions`,
        imageUrl: null,
        siteSection: 'whatson',
        analyticsCategory: 'public-programme'
      };
    } else {
      return {statusCode: 404};
    }
  }

  render() {
    const {exhibitions, period, displayTitle} = this.props;

    return (
      <LayoutPaginatedResults
        title={displayTitle}
        description={[{
          type: 'paragraph',
          text: pageDescription,
          spans: []
        }]}
        paginatedResults={exhibitions}
        paginationRoot={`exhibitions${(period ? `/${period}` : '')}`}
      />
    );
  }
};

export default PageWrapper(ExhibitionsListPage);
