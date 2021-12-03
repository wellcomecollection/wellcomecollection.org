import { FC } from 'react';
import { orderEventsByNextAvailableDate } from '@weco/common/services/prismic/events';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import LayoutPaginatedResults from '../components/LayoutPaginatedResults/LayoutPaginatedResults';
import type { PaginatedResults } from '@weco/common/services/prismic/types';
import type { Period } from '@weco/common/model/periods';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
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
import { isNotUndefined, isString } from '@weco/common/utils/array';
import { createClient } from '../services/prismic/fetch';
import { fetchEvents } from '../services/prismic/fetch/events';
import {
  availableOnlinePredicate,
  getPeriodPredicates,
  isOnlinePredicate,
  isPeriod,
} from '../services/prismic/predicates';
import { Event } from '../model/events';
import { transformQuery } from '../services/prismic/transformers/paginated-results';
import { transformEvent } from '../services/prismic/transformers/events';

type Props = {
  displayTitle: string;
  events: PaginatedResults<Event>;
  period?: Period;
};

const pageDescription =
  'Our events are now taking place online. Choose from an inspiring range of free talks, discussions and more.';

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const { page = '1', period = 'current-and-coming-up' } = context.query;
    if (!isString(page)) {
      return { notFound: true };
    }
    const parsedPage = parseInt(page, 10);
    if (isNaN(parsedPage)) {
      return appError(context, 400, `${page} is not a number`);
    }

    if (!isPeriod(period)) {
      return appError(context, 400, `${period} is not a period`);
    }
    const startField = 'my.events.times.startDateTime';
    const endField = 'my.events.times.endDateTime';
    const periodPredicates = getPeriodPredicates({
      startField,
      endField,
      period,
    });

    const isOnline = context.query.isOnline === 'true';
    const availableOnline = context.query.availableOnline === 'true';
    const predicates = [
      isOnline ? isOnlinePredicate : undefined,
      availableOnline ? availableOnlinePredicate : undefined,
      ...periodPredicates,
    ].filter(isNotUndefined);

    const direction = period === 'past' ? 'desc' : ('asc' as const);
    const orderings: { field: string; direction: typeof direction } = {
      field: 'my.events.times.startDateTime',
      direction,
    };

    const client = createClient(context);
    const eventsQuery = await fetchEvents(client, {
      page: parsedPage,
      predicates,
      orderings,
    });

    const events = transformQuery(eventsQuery, transformEvent);

    const title = (period === 'past' ? 'Past e' : 'E') + 'vents';

    const serverData = await getServerData(context);
    return {
      props: removeUndefinedProps({
        events,
        title,
        period,
        displayTitle: title,
        serverData,
      }),
    };
  };

const EventsPage: FC<Props> = props => {
  const { events, displayTitle, period } = props;
  const convertedEvents = events.results.map(convertJsonToDates);
  const convertedPaginatedResults = {
    ...events,
    results:
      period !== 'past'
        ? orderEventsByNextAvailableDate(convertedEvents)
        : convertedEvents,
  } as PaginatedResults<Event>;

  const firstEvent = events.results[0];

  return (
    <PageLayout
      title={displayTitle}
      description={pageDescription}
      url={{ pathname: `/events${period ? `/${period}` : ''}` }}
      jsonLd={events.results.flatMap(eventLd)}
      openGraphType={'website'}
      siteSection={'whats-on'}
      imageUrl={
        firstEvent &&
        firstEvent.image &&
        convertImageUri(firstEvent.image.contentUrl, 800)
      }
      imageAltText={
        (firstEvent && firstEvent.image && firstEvent.image.alt) ?? undefined
      }
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
};

export default EventsPage;
