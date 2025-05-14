import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import { getServerData } from '@weco/common/server-data';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { fromQuery } from '@weco/content/components/SearchPagesLink/Events';
import { eventLdContentApi } from '@weco/content/services/prismic/transformers/json-ld';
import { getEvents } from '@weco/content/services/wellcome/content/events';
import { getPage } from '@weco/content/utils/query-params';
import { cacheTTL, setCacheControl } from '@weco/content/utils/setCacheControl';

import * as page from './index';

export const getServerSideProps: GetServerSideProps<
  page.Props | AppErrorProps
> = async context => {
  setCacheControl(context.res, cacheTTL.events);
  const page = getPage(context.query);

  if (typeof page !== 'number') {
    return appError(context, 400, page.message);
  }

  const serverData = await getServerData(context);

  const { availableOnline, page: pageQuery, ...restOfQuery } = context.query;

  if (availableOnline) {
    return {
      redirect: {
        permanent: false,
        destination: '/events/past?isAvailableOnline=true',
      },
    };
  }

  const params = fromQuery(restOfQuery);
  const timespan = 'past';
  const setParams = { timespan, filterOutExhibitions: 'true' };

  const allPossibleParams = { ...params, ...setParams };
  const queriedParams = { ...restOfQuery, ...setParams };

  const eventResponseList = await getEvents({
    params: {
      ...queriedParams,
      sort: 'times.startDateTime',
      sortOrder: 'desc',
      ...(page && { page: Number(page) }),
      aggregations: [
        'format',
        'audience',
        'interpretation',
        'location',
        'isAvailableOnline',
      ].filter(isNotUndefined),
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
      props: serialiseProps({
        events: eventResponseList,
        period: timespan,
        query: context.query,
        eventsRouteProps: allPossibleParams,
        jsonLd,
        serverData,
      }),
    };
  }

  return { notFound: true };
};

const EventsPast: FunctionComponent<page.Props> = (props: page.Props) => {
  return <page.default {...props}></page.default>;
};

export default EventsPast;
