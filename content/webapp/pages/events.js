// @flow
import { Component } from 'react';
import { getEvents } from '@weco/common/services/prismic/events';
import { eventLd } from '@weco/common/utils/json-ld';
import PageWrapper from '@weco/common/views/components/PageWrapper/PageWrapper';
import LayoutPaginatedResults from '@weco/common/views/components/LayoutPaginatedResults/LayoutPaginatedResults';
import type { GetInitialPropsProps } from '@weco/common/views/components/PageWrapper/PageWrapper';
import type { UiEvent } from '@weco/common/model/events';
import type { PaginatedResults } from '@weco/common/services/prismic/types';

type Props = {|
  displayTitle: string,
  events: PaginatedResults<UiEvent>
|}

const pageDescription = 'Choose from an inspiring range of free talks, tours, discussions and more on at Wellcome Collection in London.';
export class ArticleSeriesPage extends Component<Props> {
  static getInitialProps = async (context: GetInitialPropsProps) => {
    const { page = 1 } = context.query;
    const {period = 'current-and-coming-up'} = context.query;
    const events = await getEvents(context.req, {
      page,
      pageSize: 100,
      period,
      order: period === 'past' ? 'desc' : 'asc'
    });
    if (events) {
      const title = (period === 'past' ? 'Past e' : 'E') + 'vents';
      return {
        events,
        title,
        displayTitle: title,
        description: pageDescription,
        type: 'website',
        canonicalUrl: `https://wellcomecollection.org/events${period ? `/${period}` : ''}`,
        imageUrl: null,
        siteSection: 'whatson',
        analyticsCategory: 'public-programme',
        pageJsonLd: events.results.map(event => eventLd(event))
      };
    } else {
      return { statusCode: 404 };
    }
  }

  render() {
    const { events, displayTitle } = this.props;

    return (
      <LayoutPaginatedResults
        title={displayTitle}
        description={[{
          type: 'paragraph',
          text: pageDescription,
          spans: []
        }]}
        paginatedResults={events}
      />
    );
  }
};

export default PageWrapper(ArticleSeriesPage);
