import { FunctionComponent } from 'react';
import { orderEventsByNextAvailableDate } from '@weco/content/services/prismic/events';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import LayoutPaginatedResults from '@weco/content/components/LayoutPaginatedResults/LayoutPaginatedResults';
import { PaginatedResults } from '@weco/common/services/prismic/types';

import MoreLink from '@weco/common/views/components/MoreLink/MoreLink';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import Space from '@weco/common/views/components/styled/Space';
import { GetServerSideProps } from 'next';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import { eventLd } from '@weco/content/services/prismic/transformers/json-ld';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchEvents } from '@weco/content/services/prismic/fetch/events';
import { getPage } from '@weco/content/utils/query-params';
import {
  transformEvent,
  transformEventBasic,
} from '@weco/content/services/prismic/transformers/events';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';
import { pageDescriptions } from '@weco/common/data/microcopy';
import { EventBasic } from '@weco/content/types/events';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import { cacheTTL, setCacheControl } from '@weco/common/utils/setCacheControl';
import { Period } from '@weco/common/types/periods';

export type Props = {
  title: string;
  events: PaginatedResults<EventBasic>;
  period?: Period;
  jsonLd: JsonLdObj[];
};

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async context => {
  setCacheControl(context.res, cacheTTL.events);
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
  const basicEvents = transformQuery(eventsQueryPromise, transformEventBasic);

  if (events) {
    const title = (period === 'past' ? 'Past e' : 'E') + 'vents';
    const jsonLd = events.results.flatMap(eventLd);
    return {
      props: serialiseProps({
        events: {
          ...events,
          results: basicEvents.results,
        },
        title,
        period: period as Period,
        jsonLd,
        serverData,
      }),
    };
  } else {
    return { notFound: true };
  }
};

const EventsPage: FunctionComponent<Props> = props => {
  const { events, title, period, jsonLd } = props;
  const convertedPaginatedResults = {
    ...events,
    results:
      period !== 'past'
        ? orderEventsByNextAvailableDate(events.results)
        : events.results,
  };
  const firstEvent = events.results[0];
  return (
    <PageLayout
      title={title}
      description={pageDescriptions.events}
      url={{ pathname: `/events${period ? `/${period}` : ''}` }}
      jsonLd={jsonLd}
      openGraphType="website"
      siteSection="whats-on"
      image={firstEvent?.promo?.image}
    >
      <SpacingSection>
        <LayoutPaginatedResults
          title={title}
          description={pageDescriptions.events}
          paginatedResults={convertedPaginatedResults}
        />
        {period === 'current-and-coming-up' && (
          <Layout12>
            <Space v={{ size: 'm', properties: ['margin-top'] }}>
              <MoreLink url={'/events/past'} name="View past events" />
            </Space>
          </Layout12>
        )}
      </SpacingSection>
    </PageLayout>
  );
};

export default EventsPage;
