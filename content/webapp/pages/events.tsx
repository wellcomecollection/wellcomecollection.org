import { FC } from 'react';
import { orderEventsByNextAvailableDate } from '../services/prismic/events';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import LayoutPaginatedResults from '../components/LayoutPaginatedResults/LayoutPaginatedResults';
import type { PaginatedResults } from '@weco/common/services/prismic/types';
import type { Period } from '@weco/common/model/periods';
import { convertJsonToDates } from './event';
import MoreLink from '@weco/common/views/components/MoreLink/MoreLink';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import Space from '@weco/common/views/components/styled/Space';
import { GetServerSideProps } from 'next';
import { appError, AppErrorProps } from '@weco/common/views/pages/_app';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import { eventLd } from '../services/prismic/transformers/json-ld';
import { createClient } from '../services/prismic/fetch';
import { fetchEvents } from '../services/prismic/fetch/events';
import { getPage } from '../utils/query-params';
import { transformEvent } from '../services/prismic/transformers/events';
import { transformQuery } from '../services/prismic/transformers/paginated-results';
import { pageDescriptions } from '@weco/common/data/microcopy';
import { Event } from '../types/events';

type Props = {
  displayTitle: string;
  events: PaginatedResults<Event>;
  period?: Period;
};

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const page = getPage(context.query);

    if (typeof page !== 'number') {
      return appError(context, 400, page.message);
    }

    const serverData = await getServerData(context);

    const {
      period = 'current-and-coming-up',
      isOnline,
      availableOnline,
    } = context.query;

    const client = createClient(context);

    const eventsQueryPromise = await fetchEvents(client, {
      page,
      period: period as 'current-and-coming-up' | 'past' | undefined,
      pageSize: 100,
      isOnline: isOnline === 'true',
      availableOnline: availableOnline === 'true',
    });

    const events = transformQuery(eventsQueryPromise, transformEvent);

    if (events) {
      const title = (period === 'past' ? 'Past e' : 'E') + 'vents';
      return {
        props: removeUndefinedProps({
          events,
          title,
          period: period as Period,
          displayTitle: title,
          serverData,
        }),
      };
    } else {
      return { notFound: true };
    }
  };

const EventsPage: FC<Props> = props => {
  const { events, displayTitle, period } = props;
  const convertedEvents = events.results.map(convertJsonToDates);
  const convertedPaginatedResults = {
    ...events,
    results:
      period !== 'past'
        ? orderEventsByNextAvailableDate(convertedEvents) as Event[]
        : convertedEvents,
  };
  const firstEvent = events.results[0];
  return (
    <PageLayout
      title={displayTitle}
      description={pageDescriptions.events}
      url={{ pathname: `/events${period ? `/${period}` : ''}` }}
      jsonLd={events.results.flatMap(eventLd)}
      openGraphType={'website'}
      siteSection={'whats-on'}
      image={firstEvent && firstEvent.image}
    >
      <SpacingSection>
        <LayoutPaginatedResults
          showFreeAdmissionMessage={true}
          title={displayTitle}
          description={[
            {
              type: 'paragraph',
              text: pageDescriptions.events,
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
};

export default EventsPage;
