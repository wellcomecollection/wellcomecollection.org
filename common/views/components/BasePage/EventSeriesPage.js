// @flow
import {Fragment} from 'react';
import BasePage from './BasePage';
import {
  default as BaseHeader,
  getFeaturedMedia
} from '../BaseHeader/BaseHeader';
import Body from '../Body/Body';
import WobblyBackground from '../BaseHeader/WobblyBackground';
import Contributors from '../Contributors/Contributors';
import EventPromo from '../EventPromo/EventPromo';
import {grid, spacing} from '../../../utils/classnames';
import type {EventSeries} from '../../../model/event-series';
import type {UiEvent} from '../../../model/events';

type Props = {|
  events: UiEvent[],
  series: EventSeries,
  showContributorsTitle: boolean
|}

function convertEventsToEventPromo(events: UiEvent[]): EventPromo[] {
  return events.map((event, i) => {
    return event.times.map(time => ({
      id: event.id,
      url: `/events/${event.id}`,
      title: event.title,
      start: time.range.startDateTime,
      end: time.range.endDateTime,
      isFullyBooked: false,
      hasNotFullyBookedTimes: true,
      format: event.format,
      image: event.promo && event.promo.image,
      interpretations: event.interpretations,
      eventbriteId: event.eventbriteId,
      dateString: null,
      timeString: null,
      audience: event.audiences.length > 0 ? event.audiences[0] : null,
      schedule: [],
      series: event.series,
      position: i
    }));
  }).reduce((acc, val) => acc.concat(val), [])
    .map(data => <EventPromo key={data.id} {...data} />);
}

const Page = ({
  events,
  series
}: Props) => {
  const body = series.description ? [{
    type: 'text',
    weight: 'default',
    value: series.description
  }] : [];
  const FeaturedMedia = getFeaturedMedia({
    id: series.id,
    title: series.title,
    contributors: series.contributors,
    contributorsTitle: series.contributorsTitle,
    promo: series.promo,
    body: body
  });
  const Header = (<BaseHeader
    title={series.title}
    Background={<WobblyBackground />}
    TagBar={null}
    DateInfo={null}
    InfoBar={null}
    Description={null}
    FeaturedMedia={FeaturedMedia}
  />);
  const upcomingEvents = events.filter(event => {
    const lastStartTime = event.times.length > 0 ? event.times[event.times.length - 1].range.startDateTime : null;
    const inTheFuture = lastStartTime ? new Date(lastStartTime) > new Date() : false;

    return inTheFuture;
  });
  const upcomingEventsIds = upcomingEvents.map(event => event.id);
  const pastEvents = events.filter(event => upcomingEventsIds.indexOf(event.id) === -1);
  const UpcomingEventPromos = convertEventsToEventPromo(upcomingEvents);
  const PastEventPromos = convertEventsToEventPromo(pastEvents);

  return (
    <BasePage
      id={series.id}
      Header={Header}
      Body={<Body body={body} />}
      lists={
        <Fragment>
          <div className={`row ${spacing({ s: 4 }, { margin: ['bottom'] })}`}>
            <div className='container'>
              <div className='grid'>
                <div className={grid({s: 12, m: 612, l: 12, xl: 12})}>
                  <h2 className='h2'>Upcoming events</h2>
                </div>
                {UpcomingEventPromos.reverse().map(Promo => {
                  return (
                    <div key={Promo.props.id} className={grid({s: 12, m: 6, l: 4, xl: 4})}>
                      <Fragment>{Promo}</Fragment>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className={`row ${spacing({ s: 4 }, { margin: ['bottom'] })}`}>
            <div className='container'>
              <div className='grid'>
                <div className={grid({s: 12, m: 612, l: 12, xl: 12})}>
                  <h2 className='h2'>Past events</h2>
                </div>
                {PastEventPromos.map(Promo => {
                  return (
                    <div key={Promo.props.id} className={[
                      grid({s: 12, m: 6, l: 4, xl: 4}),
                      spacing({ s: 3 }, { margin: ['bottom'] })
                    ].join(' ')}>
                      <Fragment>{Promo}</Fragment>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Fragment>
      }>
      <Fragment>
        {series.contributors.length > 0 &&
          <Contributors
            titleOverride={series.contributorsTitle}
            contributors={series.contributors} />
        }
      </Fragment>
    </BasePage>
  );
};

export default Page;
