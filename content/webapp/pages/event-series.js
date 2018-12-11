// @flow
import type {Context} from 'next';
import {Component} from 'react';
import {getEventSeries} from '@weco/common/services/prismic/event-series';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import ContentPage from '@weco/common/views/components/ContentPage/ContentPage';
import Body from '@weco/common/views/components/Body/Body';
import SearchResults from '@weco/common/views/components/SearchResults/SearchResults';
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';
import {
  default as PageHeader,
  getFeaturedMedia
} from '@weco/common/views/components/PageHeader/PageHeader';
import {convertImageUri} from '@weco/common/utils/convert-image-uri';
import {spacing} from '@weco/common/utils/classnames';
import {eventLd} from '@weco/common/utils/json-ld';
import {convertJsonToDates} from './event';
import type {EventSeries} from '@weco/common/model/event-series';
import type {UiEvent} from '@weco/common/model/events';

type Props = {|
  series: EventSeries,
  events: UiEvent[]
|}

export class EventSeriesPage extends Component<Props> {
  static getInitialProps = async (ctx: Context) => {
    const {id} = ctx.query;
    const seriesAndEvents = await getEventSeries(ctx.req, {
      id,
      pageSize: 100
    });

    if (seriesAndEvents) {
      const {series, events} = seriesAndEvents;
      return {
        series,
        events
      };
    }
  }

  render() {
    const {series} = this.props;
    const jsonEvents = this.props.events;
    const events = jsonEvents.map(convertJsonToDates);

    const breadcrumbs = {
      items: [
        {
          url: '/events',
          text: 'Events'
        },
        {
          url: `/events-series/${series.id}`,
          text: series.title,
          isHidden: true
        }
      ]
    };

    const genericFields = {
      id: series.id,
      title: series.title,
      contributors: series.contributors,
      contributorsTitle: series.contributorsTitle,
      promo: series.promo,
      body: series.body,
      standfirst: series.standfirst,
      promoImage: series.promoImage,
      promoText: series.promoText,
      image: series.image,
      squareImage: series.squareImage,
      widescreenImage: series.widescreenImage,
      labels: series.labels,
      metadataDescription: series.metadataDescription
    };

    const FeaturedMedia = getFeaturedMedia(genericFields);
    const Header = <PageHeader
      breadcrumbs={breadcrumbs}
      labels={{labels: series.labels}}
      title={series.title}
      ContentTypeInfo={null}
      Background={<HeaderBackground hasWobblyEdge={true} />}
      FeaturedMedia={FeaturedMedia}
      HeroPicture={null}
    />;

    const upcomingEvents = events.filter(event => {
      const lastStartTime = event.times.length > 0 ? event.times[event.times.length - 1].range.startDateTime : null;
      const inTheFuture = lastStartTime ? new Date(lastStartTime) > new Date() : false;
      return inTheFuture;
    }).sort((a, b) => a.dateRange.firstDate - b.dateRange.firstDate);
    const upcomingEventsIds = upcomingEvents.map(event => event.id);
    const pastEvents = events.filter(event => upcomingEventsIds.indexOf(event.id) === -1)
      .sort((a, b) => b.dateRange.firstDate - a.dateRange.firstDate)
      .slice(0, 3);

    return (
      <PageLayout
        title={series.title}
        description={series.metadataDescription || series.promoText || ''}
        url={{pathname: `/event-series/${series.id}`}}
        jsonLd={events.map(eventLd)}
        openGraphType={'website'}
        siteSection={'whats-on'}
        imageUrl={series.image && convertImageUri(series.image.contentUrl, 800)}
        imageAltText={series.image && series.image.alt}>
        <ContentPage
          id={series.id}
          Header={Header}
          Body={<Body body={series.body} />}
          contributorProps={{ contributors: series.contributors }}
        >
          {upcomingEvents.length > 0 &&
            <SearchResults items={upcomingEvents} title={`What's next`} />
          }
          {upcomingEvents.length === 0 &&
            <h2 className='h2'>No events scheduled at the moment, check back soon…</h2>
          }

          {pastEvents.length > 0 &&
            <div className={spacing({s: 8}, {margin: ['top']})}>
              <SearchResults items={pastEvents} title={`What we've done before`} />
            </div>
          }
        </ContentPage>
      </PageLayout>
    );
  }
};

export default EventSeriesPage;
