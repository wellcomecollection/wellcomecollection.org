import { NextPage } from 'next';

import { getServerData } from '@weco/common/server-data';
import { appError } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { eventLdContentApi } from '@weco/content/services/prismic/transformers/json-ld';
import { getEvents } from '@weco/content/services/wellcome/content/events';
import { getPage } from '@weco/content/utils/query-params';
import { cacheTTL, setCacheControl } from '@weco/content/utils/setCacheControl';
import {
  fromQuery,
  getEventFormats,
  toQuery,
} from '@weco/content/views/components/SearchPagesLink/Events';
import EventsPage, {
  Props as EventsPageProps,
} from '@weco/content/views/pages/events';

const Page: NextPage<EventsPageProps> = props => {
  return <EventsPage {...props} />;
};

type Props = ServerSideProps<EventsPageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res, cacheTTL.events);
  const page = getPage(context.query);

  if (typeof page !== 'number') {
    return appError(context, 400, page.message);
  }

  const serverData = await getServerData(context);

  const { page: pageQuery, ...restOfQuery } = context.query;
  const params = fromQuery(restOfQuery);
  const timespan = 'future';
  const { apiFormat, uiFormat } = getEventFormats({
    paramsFormat: params.format,
  });

  // Used for UI component props, so we don't show negated formats
  const eventsRouteProps = { ...params, timespan, format: uiFormat };
  // Used for API query, so we include the negated formats to exclude exhibitions
  const queriedParams = toQuery({ ...params, timespan, format: apiFormat });

  const eventResponseList = await getEvents({
    params: {
      ...queriedParams,
      sort: 'times.startDateTime',
      sortOrder: 'asc',
      ...(page && { page: Number(page) }),
      aggregations: ['format', 'audience', 'interpretation', 'location'].filter(
        isNotUndefined
      ),
    },
    pageSize: 25,
    toggles: serverData.toggles,
  });

  if (eventResponseList?.type === 'Error') {
    return appError(context, eventResponseList.httpStatus, 'Content API error');
  }

  if (eventResponseList) {
    const jsonLd = eventResponseList.results.flatMap(eventLdContentApi);

    return {
      props: serialiseProps<Props>({
        events: eventResponseList,
        query: context.query,
        eventsRouteProps,
        period: timespan,
        jsonLd,
        serverData,
      }),
    };
  }

  return { notFound: true };
};

export default Page;
export type { Props };
