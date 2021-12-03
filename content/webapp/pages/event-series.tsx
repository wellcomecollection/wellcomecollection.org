import { GetServerSideProps } from 'next';
import { FC } from 'react';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';
import PageHeader, {
  getFeaturedMedia,
} from '@weco/common/views/components/PageHeader/PageHeader';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import { convertJsonToDates } from './event';
import Space from '@weco/common/views/components/styled/Space';
import { AppErrorProps } from '@weco/common/views/pages/_app';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import Body from '../components/Body/Body';
import ContentPage from '../components/ContentPage/ContentPage';
import SearchResults from '../components/SearchResults/SearchResults';
import { eventLd } from '../services/prismic/transformers/json-ld';
import { isString } from '@weco/common/utils/array';
import { createClient } from '../services/prismic/fetch';
import { fetchEventSeriesById } from '../services/prismic/fetch/event-series';
import { fetchEvents } from '../services/prismic/fetch/events';
import { transformEventSeries } from '../services/prismic/transformers/event-series';
import { transformEvent } from '../services/prismic/transformers/events';
import { Event } from '../model/events';
import { EventSeries } from '../model/event-series';

type Props = {
  series: EventSeries;
  events: Event[];
};

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const { id } = context.query;
    if (!isString(id)) {
      return { notFound: true };
    }
    const client = createClient(context);
    const eventSeriesDocumentPromise = fetchEventSeriesById(client, id);
    const eventsQueryPromise = fetchEvents(client, {
      predicates: [`[at(my.events.series.series, "${id}")]`],
      pageSize: 100,
    });
    const [eventSeriesDocument, articlesQuery] = await Promise.all([
      eventSeriesDocumentPromise,
      eventsQueryPromise,
    ]);

    if (eventSeriesDocument) {
      const serverData = await getServerData(context);
      const eventSeries = transformEventSeries(eventSeriesDocument);
      const events = articlesQuery.results.map(transformEvent);

      return {
        props: removeUndefinedProps({
          series: eventSeries,
          events,
          serverData,
        }),
      };
    } else {
      return { notFound: true };
    }
  };

const EventSeriesPage: FC<Props> = ({ series, events: jsonEvents }) => {
  // events are passed down through getServerSideProps as JSON, so we parse them before moving forward
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
      ContentTypeInfo={null}
      Background={<HeaderBackground hasWobblyEdge={true} />}
      FeaturedMedia={FeaturedMedia}
      HeroPicture={null}
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
      imageUrl={series.image && convertImageUri(series.image.contentUrl, 800)}
      imageAltText={(series.image && series.image.alt) ?? undefined}
    >
      <ContentPage
        id={series.id}
        Header={Header}
        Body={<Body body={series.body} pageId={series.id} />}
        document={series.prismicDocument}
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
