import { GetServerSideProps } from 'next';
import { EventSeries } from '@weco/content/types/event-series';
import { EventBasic } from '@weco/content/types/events';
import { FunctionComponent } from 'react';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import { getFeaturedMedia } from '@weco/content/utils/page-header';
import Space from '@weco/common/views/components/styled/Space';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import Body from '@weco/content/components/Body/Body';
import ContentPage from '@weco/content/components/ContentPage/ContentPage';
import SearchResults from '@weco/content/components/SearchResults/SearchResults';
import { eventLd } from '@weco/content/services/prismic/transformers/json-ld';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import { fetchEvents } from '@weco/content/services/prismic/fetch/events';
import { createClient } from '@weco/content/services/prismic/fetch';
import * as prismic from '@prismicio/client';
import { fetchEventSeriesById } from '@weco/content/services/prismic/fetch/event-series';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { transformEventSeries } from '@weco/content/services/prismic/transformers/event-series';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';
import {
  transformEvent,
  transformEventBasic,
} from '@weco/content/services/prismic/transformers/events';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import { font } from '@weco/common/utils/classnames';
import { today } from '@weco/common/utils/dates';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';
import Pagination from '@weco/content/components/Pagination/Pagination';
import { getPage } from '@weco/content/utils/query-params';

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

  const upcomingEventsQueryPromise = fetchEvents(client, {
    filters: [
      prismic.filter.at('my.events.series.series', eventSeriesId),
      prismic.filter.dateAfter('my.events.times.endDateTime', today()),
    ],
    pageSize: 100,
  });

  const pastEventsQueryPromise = fetchEvents(client, {
    filters: [
      prismic.filter.at('my.events.series.series', eventSeriesId),
      prismic.filter.dateBefore('my.events.times.endDateTime', today()),
    ],
    page,
    pageSize: 20,
  });

  const seriesPromise = fetchEventSeriesById(client, eventSeriesId);

  const [upcomingEventsQuery, pastEventsQuery, seriesDocument] =
    await Promise.all([
      upcomingEventsQueryPromise,
      pastEventsQueryPromise,
      seriesPromise,
    ]);

  if (isNotUndefined(seriesDocument)) {
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
        url: `/events-series/${series.id}`,
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
      url={{ pathname: `/event-series/${series.id}` }}
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
              body={series.body}
              pageId={series.id}
            />
          ) : undefined
        }
        contributors={series.contributors}
      >
        {page === 1 && (
          <>
            {upcomingEvents.length > 0 ? (
              <SearchResults items={upcomingEvents} title="Coming up" />
            ) : (
              <h2 className={font('wb', 3)}>No upcoming events</h2>
            )}
          </>
        )}

        {pastEvents.results.length > 0 && (
          <Space $v={{ size: 'xl', properties: ['margin-top'] }}>
            <SearchResults items={pastEvents.results} title="Past events" />
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
