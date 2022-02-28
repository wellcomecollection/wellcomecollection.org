import { GetServerSideProps } from 'next';
import { EventSeries } from '../types/event-series';
import { UiEvent } from '@weco/common/model/events';
import { FC } from 'react';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';
import PageHeader, {
  getFeaturedMedia,
} from '@weco/common/views/components/PageHeader/PageHeader';
import { convertJsonToDates } from './event';
import Space from '@weco/common/views/components/styled/Space';
import { AppErrorProps } from '@weco/common/views/pages/_app';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import Body from '../components/Body/Body';
import ContentPage from '../components/ContentPage/ContentPage';
import SearchResults from '../components/SearchResults/SearchResults';
import { eventLd } from '../services/prismic/transformers/json-ld';
import { looksLikePrismicId } from '../services/prismic';
import { fetchEvents } from '../services/prismic/fetch/events';
import { createClient } from '../services/prismic/fetch';
import * as prismic from 'prismic-client-beta';
import { fetchEventSeriesById } from '../services/prismic/fetch/event-series';
import { isNotUndefined } from '@weco/common/utils/array';
import { transformEventSeries } from '../services/prismic/transformers/event-series';
import { transformQuery } from 'services/prismic/transformers/paginated-results';
import { transformEvent } from 'services/prismic/transformers/events';

type Props = {
  series: EventSeries;
  events: UiEvent[];
};

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);
    const { id } = context.query;

    if (!looksLikePrismicId(id)) {
      return { notFound: true };
    }

    const client = createClient(context);

    const eventsQueryPromise = fetchEvents(client, {
      predicates: [
        prismic.predicate.at('my.events.series.series', id as string),
      ],
      pageSize: 100,
    });

    const seriesPromise = fetchEventSeriesById(client, id as string);

    const [eventsQuery, seriesDocument] = await Promise.all([
      eventsQueryPromise,
      seriesPromise,
    ]);

    if (isNotUndefined(seriesDocument)) {
      const series = transformEventSeries(seriesDocument);
      const events = transformQuery(eventsQuery, transformEvent).results;

      return {
        props: removeUndefinedProps({
          series,
          events,
          serverData,
        }),
      };
    } else {
      return { notFound: true };
    }
  };

const EventSeriesPage: FC<Props> = ({ series, events: jsonEvents }) => {
  // events are passed down through getServerSideProps as JSON, so we nuparse them before moving forward
  // This could probably be done at the time of use, instead of globally...
  const events = jsonEvents.map(convertJsonToDates);

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

  const genericFields = {
    id: series.id,
    title: series.title,
    promo: series.promo,
    body: series.body,
    standfirst: series.standfirst,
    promoImage: series.promoImage,
    promoText: series.promoText,
    image: series.image,
    squareImage: series.squareImage,
    widescreenImage: series.widescreenImage,
    superWidescreenImage: series.superWidescreenImage,
    labels: series.labels,
    metadataDescription: series.metadataDescription,
  };

  const FeaturedMedia = getFeaturedMedia(genericFields);
  const Header = (
    <PageHeader
      breadcrumbs={breadcrumbs}
      labels={{ labels: series.labels }}
      title={series.title}
      ContentTypeInfo={undefined}
      Background={<HeaderBackground hasWobblyEdge={true} />}
      FeaturedMedia={FeaturedMedia}
      HeroPicture={undefined}
    />
  );

  const upcomingEvents = events
    .filter(event => {
      const lastStartTime =
        event.times.length > 0
          ? event.times[event.times.length - 1].range.startDateTime
          : null;
      const inTheFuture = lastStartTime
        ? new Date(lastStartTime) > new Date()
        : false;
      return inTheFuture;
    })
    .sort(
      (a, b) =>
        a.dateRange.firstDate.getTime() - b.dateRange.firstDate.getTime()
    );
  const upcomingEventsIds = upcomingEvents.map(event => event.id);
  const pastEvents = events
    .filter(event => upcomingEventsIds.indexOf(event.id) === -1)
    .sort(
      (a, b) =>
        b.dateRange.firstDate.getTime() - a.dateRange.firstDate.getTime()
    )
    .slice(0, 3);

  return (
    <PageLayout
      title={series.title}
      description={series.metadataDescription || series.promoText || ''}
      url={{ pathname: `/event-series/${series.id}` }}
      jsonLd={events.flatMap(eventLd)}
      openGraphType={'website'}
      siteSection={'whats-on'}
      image={series.image}
    >
      <ContentPage
        id={series.id}
        Header={Header}
        Body={<Body body={series.body} pageId={series.id} />}
        contributors={series.contributors}
      >
        {upcomingEvents.length > 0 && (
          <SearchResults items={upcomingEvents} title={`What's next`} />
        )}
        {upcomingEvents.length === 0 && (
          <h2 className="h2">
            No events scheduled at the moment, check back soon…
          </h2>
        )}

        {pastEvents.length > 0 && (
          <Space v={{ size: 'xl', properties: ['margin-top'] }}>
            <SearchResults
              items={pastEvents}
              title={`What we've done before`}
            />
          </Space>
        )}
      </ContentPage>
    </PageLayout>
  );
};

export default EventSeriesPage;
