// @flow
import { Component } from 'react';
import { getEvents } from '@weco/common/services/prismic/events';
import { eventLd } from '@weco/common/utils/json-ld';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import LayoutPaginatedResults from '@weco/common/views/components/LayoutPaginatedResults/LayoutPaginatedResults';
import type { GetInitialPropsProps } from '@weco/common/views/components/PageWrapper/PageWrapper';
import type { UiEvent } from '@weco/common/model/events';
import type { PaginatedResults } from '@weco/common/services/prismic/types';
import type { Period } from '@weco/common/model/periods';
import {convertJsonToDates} from './event';
import {convertImageUri} from '@weco/common/utils/convert-image-uri';

type Props = {|
  displayTitle: string,
  events: PaginatedResults<UiEvent>,
  period: ?Period
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
        period,
        displayTitle: title
      };
    } else {
      return { statusCode: 404 };
    }
  }

  render() {
    const { events, displayTitle, period } = this.props;
    const convertedEvents = events.results.map(convertJsonToDates);
    const convertedPaginatedResults = ({
      ...events,
      results: convertedEvents
    }: PaginatedResults<UiEvent>);
    const firstEvent = events.results[0];

    return (
      <PageLayout
        title={displayTitle}
        description={pageDescription}
        url={{pathname: `/events${period ? `/${period}` : ''}`}}
        jsonLd={events.results.map(eventLd)}
        openGraphType={'website'}
        imageUrl={firstEvent && firstEvent.image && convertImageUri(firstEvent.image.contentUrl, 800)}
        imageAltText={firstEvent && firstEvent.image && firstEvent.image.alt}>
        <LayoutPaginatedResults
          showFreeAdmissionMessage={true}
          title={displayTitle}
          description={[{
            type: 'paragraph',
            text: pageDescription,
            spans: []
          }]}
          paginatedResults={convertedPaginatedResults}
          paginationRoot={`events${(period ? `/${period}` : '')}`}
        />
      </PageLayout>
    );
  }
};

export default ArticleSeriesPage;
