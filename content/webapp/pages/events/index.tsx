import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import { pageDescriptions } from '@weco/common/data/microcopy';
import { getServerData } from '@weco/common/server-data';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import { Period } from '@weco/common/types/periods';
import { serialiseProps } from '@weco/common/utils/json';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import Space from '@weco/common/views/components/styled/Space';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import LayoutPaginatedResults from '@weco/content/components/LayoutPaginatedResults/LayoutPaginatedResults';
import MoreLink from '@weco/content/components/MoreLink/MoreLink';
import { orderEventsByNextAvailableDate } from '@weco/content/services/prismic/events';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchEvents } from '@weco/content/services/prismic/fetch/events';
import {
  transformEvent,
  transformEventBasic,
} from '@weco/content/services/prismic/transformers/events';
import { eventLd } from '@weco/content/services/prismic/transformers/json-ld';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';
import { EventBasic } from '@weco/content/types/events';
import { getPage } from '@weco/content/utils/query-params';
import { cacheTTL, setCacheControl } from '@weco/content/utils/setCacheControl';

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
          isPastListing={period === 'past'}
        />
        {period === 'current-and-coming-up' && (
          <ContaineredLayout gridSizes={gridSize12()}>
            <Space $v={{ size: 'm', properties: ['margin-top'] }}>
              <MoreLink url="/events/past" name="View past events" />
            </Space>
          </ContaineredLayout>
        )}
      </SpacingSection>
    </PageLayout>
  );
};

export default EventsPage;
