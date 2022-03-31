import { FC } from 'react';
import { orderEventsByNextAvailableDate } from '../services/prismic/events';
import PageLayout, {
  getServerSideVenueProps,
  WithVenueProps,
} from '@weco/common/views/components/PageLayout/PageLayout';
import LayoutPaginatedResults from '../components/LayoutPaginatedResults/LayoutPaginatedResults';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import { Period } from '../types/periods';
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
import {
  fixEventDatesInJson,
  transformEvent,
  transformEventToEventBasic,
} from '../services/prismic/transformers/events';
import { transformQuery } from '../services/prismic/transformers/paginated-results';
import { pageDescriptions } from '@weco/common/data/microcopy';
import { EventBasic } from '../types/events';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';

type Props = {
  title: string;
  events: PaginatedResults<EventBasic>;
  period?: Period;
  jsonLd: JsonLdObj[];
} & WithVenueProps;

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

    const events = transformQuery(eventsQueryPromise, event =>
      transformEventToEventBasic(transformEvent(event))
    );

    if (events) {
      const title = (period === 'past' ? 'Past e' : 'E') + 'vents';
      const venueProps = getServerSideVenueProps(serverData);
      return {
        props: removeUndefinedProps({
          events,
          title,
          period: period as Period,
          serverData,
          jsonLd: events.results.flatMap(eventLd),
          venueProps,
        }),
      };
    } else {
      return { notFound: true };
    }
  };

const EventsPage: FC<Props> = props => {
  const { events, title, period, venueProps } = props;
  const convertedEvents = events.results.map(fixEventDatesInJson);
  const convertedPaginatedResults = {
    ...events,
    results:
      period !== 'past'
        ? orderEventsByNextAvailableDate(convertedEvents)
        : convertedEvents,
  };
  const firstEvent = events.results[0];
  return (
    <PageLayout
      title={title}
      description={pageDescriptions.events}
      url={{ pathname: `/events${period ? `/${period}` : ''}` }}
      jsonLd={props.jsonLd}
      openGraphType={'website'}
      siteSection={'whats-on'}
      image={firstEvent?.image}
      {...venueProps}
    >
      <SpacingSection>
        <LayoutPaginatedResults
          showFreeAdmissionMessage={true}
          title={title}
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
