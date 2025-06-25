import * as prismic from '@prismicio/client';
import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import { getServerData } from '@weco/common/server-data';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import { font } from '@weco/common/utils/classnames';
import { today } from '@weco/common/utils/dates';
import { serialiseProps } from '@weco/common/utils/json';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import HeaderBackground from '@weco/common/views/components/HeaderBackground';
import { JsonLdObj } from '@weco/common/views/components/JsonLd';
import PageHeader from '@weco/common/views/components/PageHeader';
import PageLayout from '@weco/common/views/components/PageLayout';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';
import Space from '@weco/common/views/components/styled/Space';
import Body from '@weco/content/components/Body';
import ContentPage from '@weco/content/components/ContentPage';
import Pagination from '@weco/content/components/Pagination';
import SearchResults from '@weco/content/components/SearchResults';
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
import { EventSeries } from '@weco/content/types/event-series';
import { EventBasic } from '@weco/content/types/events';
import { getFeaturedMedia } from '@weco/content/utils/page-header';
import { getPage } from '@weco/content/utils/query-params';
import { setCacheControl } from '@weco/content/utils/setCacheControl';

type Props = {
  series: EventSeries;
  jsonLd: JsonLdObj[];
  pastEvents: PaginatedResults<EventBasic>;
  upcomingEvents: EventBasic[];
  page: number;
};

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
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
      props: serialiseProps({
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

const EventSeriesPage: FunctionComponent<Props> = ({
  series,
  jsonLd,
  pastEvents,
  upcomingEvents,
  page,
}) => {
  const breadcrumbs = {
    items: [
      {
        url: '/events',
        text: 'Events',
      },
      {
        url: linkResolver(series),
        text: series.title,
        isHidden: true,
      },
    ],
  };

  const FeaturedMedia = getFeaturedMedia(series);
  const Header = (
    <PageHeader
      breadcrumbs={breadcrumbs}
      labels={{ labels: series.labels }}
      title={series.title}
      Background={<HeaderBackground hasWobblyEdge={true} />}
      FeaturedMedia={FeaturedMedia}
    />
  );

  return (
    <PageLayout
      title={series.title}
      description={series.metadataDescription || series.promo?.caption || ''}
      url={{ pathname: `/event-series/${series.uid}` }}
      jsonLd={jsonLd}
      openGraphType="website"
      siteSection="whats-on"
      image={series.image}
      apiToolbarLinks={[createPrismicLink(series.id)]}
    >
      <ContentPage
        id={series.id}
        Header={Header}
        Body={
          page === 1 ? (
            <Body
              untransformedBody={series.untransformedBody}
              pageId={series.id}
            />
          ) : undefined
        }
        contributors={series.contributors}
      >
        {page === 1 && (
          <>
            {upcomingEvents.length > 0 ? (
              <SearchResults
                variant="default"
                items={upcomingEvents}
                title="Coming up"
              />
            ) : (
              <h2 className={font('wb', 3)}>No upcoming events</h2>
            )}
          </>
        )}

        {pastEvents.results.length > 0 && (
          <Space $v={{ size: 'xl', properties: ['margin-top'] }}>
            <SearchResults
              variant="default"
              items={pastEvents.results}
              title="Past events"
            />
          </Space>
        )}
        {pastEvents.totalPages > 1 && (
          <PaginationWrapper $verticalSpacing="m" $alignRight>
            <Pagination
              totalPages={pastEvents.totalPages}
              ariaLabel="Series pagination"
            />
          </PaginationWrapper>
        )}
      </ContentPage>
    </PageLayout>
  );
};

export default EventSeriesPage;
