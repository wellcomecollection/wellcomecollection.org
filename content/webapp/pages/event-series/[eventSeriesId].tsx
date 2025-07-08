import * as prismic from '@prismicio/client';
import { NextPage } from 'next';

import { getServerData } from '@weco/common/server-data';
import { appError } from '@weco/common/services/app';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import { today } from '@weco/common/utils/dates';
import { serialiseProps } from '@weco/common/utils/json';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchEventSeriesById } from '@weco/content/services/prismic/fetch/event-series';
import { fetchEvents } from '@weco/content/services/prismic/fetch/events';
import { transformEventSeries } from '@weco/content/services/prismic/transformers/event-series';
import {
  transformEvent,
  transformEventBasic,
} from '@weco/content/services/prismic/transformers/events';
import { eventLd } from '@weco/content/services/prismic/transformers/json-ld';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';
import { getPage } from '@weco/content/utils/query-params';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import EventSeriesPage, {
  Props as EventSeriesPageProps,
} from '@weco/content/views/pages/event-series';

const Page: NextPage<EventSeriesPageProps> = props => {
  return <EventSeriesPage {...props} />;
};

type Props = ServerSideProps<EventSeriesPageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res);
  const { eventSeriesId } = context.query;

  if (!looksLikePrismicId(eventSeriesId)) {
    return { notFound: true };
  }

  const serverData = await getServerData(context);
  const client = createClient(context);
  const page = getPage(context.query);

  if (typeof page !== 'number') {
    return appError(context, 400, page.message);
  }
  const seriesDocument = await fetchEventSeriesById(client, eventSeriesId);

  if (isNotUndefined(seriesDocument)) {
    const upcomingEventsQueryPromise = fetchEvents(client, {
      filters: [
        prismic.filter.at('my.events.series.series', seriesDocument.id),
        prismic.filter.dateAfter('my.events.times.endDateTime', today()),
      ],
      pageSize: 100,
    });

    const pastEventsQueryPromise = fetchEvents(client, {
      filters: [
        prismic.filter.at('my.events.series.series', seriesDocument.id),
        prismic.filter.dateBefore('my.events.times.endDateTime', today()),
      ],
      page,
      pageSize: 20,
    });

    const [upcomingEventsQuery, pastEventsQuery] = await Promise.all([
      upcomingEventsQueryPromise,
      pastEventsQueryPromise,
    ]);

    const series = transformEventSeries(seriesDocument);

    const upcomingEventsFull = transformQuery(
      upcomingEventsQuery,
      transformEvent
    ).results;
    const upcomingEvents = transformQuery(
      upcomingEventsQuery,
      transformEventBasic
    ).results;

    const pastEvents = transformQuery(pastEventsQuery, transformEventBasic);

    const jsonLd = upcomingEventsFull.flatMap(eventLd);

    return {
      props: serialiseProps<Props>({
        series,
        upcomingEvents,
        pastEvents,
        jsonLd,
        serverData,
        page,
      }),
    };
  }

  return { notFound: true };
};

export default Page;
