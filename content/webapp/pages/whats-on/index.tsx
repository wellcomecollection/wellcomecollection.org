import { NextPage } from 'next';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { PagesDocument as RawPagesDocument } from '@weco/common/prismicio-types';
import { getServerData } from '@weco/common/server-data';
import { isOfTypePeriod, Period } from '@weco/common/types/periods';
import {
  endOfDay,
  getNextWeekendDateRange,
  startOfDay,
} from '@weco/common/utils/dates';
import { serialiseProps } from '@weco/common/utils/json';
import { JsonLdObj } from '@weco/common/views/components/JsonLd';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchEvents } from '@weco/content/services/prismic/fetch/events';
import { fetchExhibitions } from '@weco/content/services/prismic/fetch/exhibitions';
import { fetchPage } from '@weco/content/services/prismic/fetch/pages';
import {
  transformEvent,
  transformEventBasic,
} from '@weco/content/services/prismic/transformers/events';
import { transformExhibitionsQuery } from '@weco/content/services/prismic/transformers/exhibitions';
import {
  eventLd,
  exhibitionLd,
} from '@weco/content/services/prismic/transformers/json-ld';
import { transformPage } from '@weco/content/services/prismic/transformers/pages';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';
import { getTryTheseTooPromos } from '@weco/content/services/prismic/transformers/whats-on';
import { cacheTTL, setCacheControl } from '@weco/content/utils/setCacheControl';
import WhatsOnPage, {
  Props as WhatsOnPageProps,
} from '@weco/content/views/pages/whats-on';

const Page: NextPage<WhatsOnPageProps> = props => {
  return <WhatsOnPage {...props} />;
};

type Props = ServerSideProps<WhatsOnPageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res, cacheTTL.events);
  const serverData = await getServerData(context);

  const client = createClient(context);

  let period: Period;

  if (context.query.period) {
    const test = context.query.period.toString();
    if (isOfTypePeriod(test)) {
      period = test;
    } else {
      return { notFound: true };
    }
  } else {
    period = 'current-and-coming-up';
  }

  const whatsOnPagePromise = fetchPage(client, prismicPageIds.whatsOn);

  const exhibitionsQueryPromise = fetchExhibitions(client, {
    period,
    order: 'asc',
  });

  const eventsQueryPromise = fetchEvents(client, {
    period: 'current-and-coming-up',
    pageSize: 100,
  });

  const availableOnlineEventsQueryPromise = fetchEvents(client, {
    period: 'past',
    pageSize: 6,
    availableOnline: true,
  });

  const [
    exhibitionsQuery,
    eventsQuery,
    availableOnlineEventsQuery,
    whatsOnPageDocument,
  ] = await Promise.all([
    exhibitionsQueryPromise,
    eventsQueryPromise,
    availableOnlineEventsQueryPromise,
    whatsOnPagePromise,
  ]);

  const whatsOnPage = transformPage(whatsOnPageDocument as RawPagesDocument);

  const tryTheseToo = getTryTheseTooPromos(whatsOnPage);

  const dateRange = getRangeForPeriod(period);

  const events = transformQuery(eventsQuery, transformEvent).results;
  const exhibitions = transformExhibitionsQuery(exhibitionsQuery).results;
  const availableOnlineEvents = transformQuery(
    availableOnlineEventsQuery,
    transformEventBasic
  ).results;

  const basicEvents = transformQuery(eventsQuery, transformEventBasic).results;

  if (period && events && exhibitions) {
    const jsonLd = [
      ...exhibitions.map(exhibitionLd),
      ...events.map(eventLd),
    ] as JsonLdObj[];

    return {
      props: serialiseProps<Props>({
        pageId: whatsOnPage.id,
        period,
        exhibitions,
        events: basicEvents,
        availableOnlineEvents,
        dateRange,
        jsonLd,
        tryTheseToo,
        serverData,
      }),
    };
  } else {
    return { notFound: true };
  }
};

export function getRangeForPeriod(period: Period): { start: Date; end?: Date } {
  const today = new Date();

  switch (period) {
    case 'today':
      return {
        start: startOfDay(today),
        end: endOfDay(today),
      };
    case 'this-weekend':
      return getNextWeekendDateRange(today);
    default:
      return { start: startOfDay(today) };
  }
}

export default Page;
