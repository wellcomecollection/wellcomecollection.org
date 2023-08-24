import { GetServerSideProps } from 'next';
import { EventSeries } from '@weco/content/types/event-series';
import { EventBasic } from '@weco/content/types/events';
import { FunctionComponent } from 'react';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import { getFeaturedMedia } from '@weco/content/utils/page-header';
import Space from '@weco/common/views/components/styled/Space';
import { AppErrorProps } from '@weco/common/services/app';
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
import { getUpcomingEvents } from '@weco/content/utils/event-series';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { setCacheControl } from '@weco/common/utils/setCacheControl';
import { font } from '@weco/common/utils/classnames';

type Props = {
  series: EventSeries;
  jsonLd: JsonLdObj[];
  pastEvents: EventBasic[];
  upcomingEvents: EventBasic[];
};

function getPastEvents(
  events: EventBasic[],
  upcomingEventsIds: Set<string>
): EventBasic[] {
  return events
    .filter(event => !upcomingEventsIds.has(event.id))
    .sort((a, b) => {
      const aStartTime = Math.min(
        ...a.times.map(aTime => aTime.range.startDateTime.valueOf())
      );
      const bStartTime = Math.min(
        ...b.times.map(bTime => bTime.range.startDateTime.valueOf())
      );
      return bStartTime - aStartTime;
    });
}

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async context => {
  setCacheControl(context.res);
  const serverData = await getServerData(context);
  const { eventSeriesId } = context.query;

  if (!looksLikePrismicId(eventSeriesId)) {
    return { notFound: true };
  }

  const client = createClient(context);

  const eventsQueryPromise = fetchEvents(client, {
    filters: [prismic.filter.at('my.events.series.series', eventSeriesId)],
    pageSize: 100,
  });

  const seriesPromise = fetchEventSeriesById(client, eventSeriesId);

  const [eventsQuery, seriesDocument] = await Promise.all([
    eventsQueryPromise,
    seriesPromise,
  ]);

  if (isNotUndefined(seriesDocument)) {
    const series = transformEventSeries(seriesDocument);

    const fullEvents = transformQuery(eventsQuery, transformEvent).results;
    const events = transformQuery(eventsQuery, transformEventBasic).results;

    const upcomingEvents = getUpcomingEvents(events);
    const upcomingEventsIds = new Set(upcomingEvents.map(event => event.id));

    const pastEvents = getPastEvents(events, upcomingEventsIds);

    const jsonLd = fullEvents.flatMap(eventLd);

    return {
      props: serialiseProps({
        series,
        upcomingEvents,
        pastEvents,
        jsonLd,
        serverData,
      }),
    };
  } else {
    return { notFound: true };
  }
};

const EventSeriesPage: FunctionComponent<Props> = ({
  series,
  jsonLd,
  pastEvents,
  upcomingEvents,
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
        Body={<Body body={series.body} pageId={series.id} />}
        contributors={series.contributors}
      >
        {upcomingEvents.length > 0 ? (
          <SearchResults items={upcomingEvents} title="Coming up" />
        ) : (
          <h2 className={font('wb', 3)}>No upcoming events</h2>
        )}

        {pastEvents.length > 0 && (
          <Space v={{ size: 'xl', properties: ['margin-top'] }}>
            <SearchResults items={pastEvents} title="Past events" />
          </Space>
        )}
      </ContentPage>
    </PageLayout>
  );
};

export default EventSeriesPage;
