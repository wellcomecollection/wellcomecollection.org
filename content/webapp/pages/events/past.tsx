import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import { getServerData } from '@weco/common/server-data';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import { getQueryPropertyValue } from '@weco/common/utils/search';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchEvents } from '@weco/content/services/prismic/fetch/events';
import {
  transformEvent,
  transformEventBasic,
} from '@weco/content/services/prismic/transformers/events';
import {
  eventLd,
  eventLdContentApi,
} from '@weco/content/services/prismic/transformers/json-ld';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';
import { getEvents } from '@weco/content/services/wellcome/content/events';
import { getPage } from '@weco/content/utils/query-params';
import { cacheTTL, setCacheControl } from '@weco/content/utils/setCacheControl';

import * as page from './index';

export const getServerSideProps: GetServerSideProps<
  (page.NewProps | page.Props) | AppErrorProps
> = async context => {
  setCacheControl(context.res, cacheTTL.events);
  const page = getPage(context.query);

  if (typeof page !== 'number') {
    return appError(context, 400, page.message);
  }

  const serverData = await getServerData(context);
  const isUsingContentAPI = !!serverData.toggles.filterEventsListing.value;

  if (isUsingContentAPI) {
    const { availableOnline, page } = context.query;

    if (availableOnline) {
      return {
        redirect: {
          permanent: false,
          destination: '/events/past?isAvailableOnline=true',
        },
      };
    }

    const pageNumber = getQueryPropertyValue(page);
    const paramsQuery = { timespan: getQueryPropertyValue('past') || '' };

    const eventResponseList = await getEvents({
      params: {
        ...paramsQuery,
        sort: getQueryPropertyValue(context.query.sort),
        sortOrder: getQueryPropertyValue(context.query.sortOrder),
        ...(pageNumber && { page: Number(pageNumber) }),
      },
      pageSize: 25,
      toggles: serverData.toggles,
    });

    if (eventResponseList?.type === 'Error') {
      return appError(
        context,
        eventResponseList.httpStatus,
        'Content API error'
      );
    }

    if (eventResponseList) {
      const jsonLd = eventResponseList.results.flatMap(eventLdContentApi);

      return {
        props: serialiseProps({
          events: eventResponseList,
          period: 'past',
          jsonLd,
          serverData,
        }),
      };
    }

    return { notFound: true };
  } else {
    const { isOnline, availableOnline } = context.query;

    const client = createClient(context);

    const eventsQueryPromise = await fetchEvents(client, {
      page,
      period: 'past',
      pageSize: 100,
      isOnline: isOnline === 'true',
      availableOnline: availableOnline === 'true',
    });

    const events = transformQuery(eventsQueryPromise, transformEvent);
    const basicEvents = transformQuery(eventsQueryPromise, transformEventBasic);

    if (events) {
      const title = 'Past events';
      const jsonLd = events.results.flatMap(eventLd);

      return {
        props: serialiseProps({
          events: {
            ...events,
            results: basicEvents.results,
          },
          title,
          period: 'past',
          jsonLd,
          serverData,
        }),
      };
    } else {
      return { notFound: true };
    }
  }
};

const EventsPast: FunctionComponent<page.Props> = (props: page.Props) => {
  return <page.default {...props}></page.default>;
};

export default EventsPast;
