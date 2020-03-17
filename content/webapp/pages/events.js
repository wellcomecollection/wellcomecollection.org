// @flow
import type { Context } from 'next';
import { Component } from 'react';
import {
  getEvents,
  orderEventsByNextAvailableDate,
} from '@weco/common/services/prismic/events';
import { eventLd } from '@weco/common/utils/json-ld';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import LayoutPaginatedResults from '@weco/common/views/components/LayoutPaginatedResults/LayoutPaginatedResults';
import type { UiEvent } from '@weco/common/model/events';
import type { PaginatedResults } from '@weco/common/services/prismic/types';
import type { Period } from '@weco/common/model/periods';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import { convertJsonToDates } from './event';
import MoreLink from '@weco/common/views/components/MoreLink/MoreLink';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import Space from '@weco/common/views/components/styled/Space';

type Props = {|
  displayTitle: string,
  events: PaginatedResults<UiEvent>,
  period: ?Period,
|};

const pageDescription =
  'Choose from an inspiring range of free talks, tours, discussions and more on at Wellcome Collection in London.';
export class ArticleSeriesPage extends Component<Props> {
  static getInitialProps = async (ctx: Context) => {
    const { page = 1 } = ctx.query;
    const { period = 'current-and-coming-up' } = ctx.query;
    const events = await getEvents(ctx.req, {
      page,
      period,
      pageSize: 100,
    });
    if (events) {
      const title = (period === 'past' ? 'Past e' : 'E') + 'vents';
      return {
        events,
        title,
        period,
        displayTitle: title,
      };
    } else {
      return { statusCode: 404 };
    }
  };

  render() {
    const { events, displayTitle, period } = this.props;
    const convertedEvents = events.results.map(convertJsonToDates);
    const convertedPaginatedResults = ({
      ...events,
      results:
        period !== 'past'
          ? orderEventsByNextAvailableDate(convertedEvents)
          : convertedEvents,
    }: PaginatedResults<UiEvent>);
    const firstEvent = events.results[0];

    return (
      <PageLayout
        title={displayTitle}
        description={pageDescription}
        url={{ pathname: `/events${period ? `/${period}` : ''}` }}
        jsonLd={events.results.map(eventLd)}
        openGraphType={'website'}
        siteSection={'whats-on'}
        imageUrl={
          firstEvent &&
          firstEvent.image &&
          convertImageUri(firstEvent.image.contentUrl, 800)
        }
        imageAltText={firstEvent && firstEvent.image && firstEvent.image.alt}
      >
        <SpacingSection>
          <LayoutPaginatedResults
            showFreeAdmissionMessage={true}
            title={displayTitle}
            description={[
              {
                type: 'paragraph',
                text: pageDescription,
                spans: [],
              },
            ]}
            paginatedResults={convertedPaginatedResults}
            paginationRoot={`events${period ? `/${period}` : ''}`}
          />
          {period === 'current-and-coming-up' && (
            <Layout12>
              <Space v={{ size: 'm', properties: ['margin-top'] }}>
                <MoreLink url={`/events/past`} name={`View past events`} />
              </Space>
            </Layout12>
          )}
        </SpacingSection>
      </PageLayout>
    );
  }
}

export default ArticleSeriesPage;
