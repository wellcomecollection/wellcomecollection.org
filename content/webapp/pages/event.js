// @flow
import {Component, Fragment} from 'react';
import Prismic from 'prismic-javascript';
import PageWrapper from '@weco/common/views/components/PageWrapper/PageWrapper';
import BasePage from '@weco/common/views/components/BasePage/BasePage';
import Body from '@weco/common/views/components/Body/Body';
import Contributors from '@weco/common/views/components/Contributors/Contributors';
import EventSchedule from '@weco/common/views/components/EventSchedule/EventSchedule';
import Icon from '@weco/common/views/components/Icon/Icon';
import Button from '@weco/common/views/components/Buttons/Button/Button';
import EventbriteButton from '@weco/common/views/components/EventbriteButton/EventbriteButton';
import SecondaryLink from '@weco/common/views/components/Links/SecondaryLink/SecondaryLink';
import Message from '@weco/common/views/components/Message/Message';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import InfoBox from '@weco/common/views/components/InfoBox/InfoBox';
import {UiImage} from '@weco/common/views/components/Images/Images';
import DateRange from '@weco/common/views/components/DateRange/DateRange';
import type {UiEvent} from '@weco/common/model/events';
import {spacing, font, classNames} from '@weco/common/utils/classnames';
import camelize from '@weco/common/utils/camelize';
import {
  formatDayDate,
  isTimePast,
  isDatePast,
  formatTime
} from '@weco/common/utils/format-date';
import EventDateRange from '@weco/common/views/components/EventDateRange/EventDateRange';
import HeaderBackground from '@weco/common/views/components/BaseHeader/HeaderBackground';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import {getEvent, getEvents} from '@weco/common/services/prismic/events';
import {convertImageUri} from '@weco/common/utils/convert-image-uri';
import type {GetInitialPropsProps} from '@weco/common/views/components/PageWrapper/PageWrapper';
import {eventLd} from '@weco/common/utils/json-ld';
import {isEventFullyBooked} from '@weco/common/model/events';

type Props = {|
  event: UiEvent
|}

type State = {|
  scheduledIn: ?UiEvent
|}

// TODO: Probably use the StatusIndicator?
function EventStatus(text, color) {
  return (
    <div className='flex'>
      <div className={`${font({s: 'HNM5'})} flex flex--v-center`}>
        <span className={`${spacing({s: 1}, {margin: ['right']})} flex flex--v-center`}>
          <Icon name='statusIndicator' extraClasses={`icon--match-text icon--${color}`} />
        </span>
        {text}
      </div>
    </div>
  );
}

function DateList(event) {
  return (
    event.times && <Fragment>
      {event.times.map((eventTime, index) => {
        return (
          <div key={index} className={`flex flex--h-space-between border-top-width-1 border-color-pumice ${spacing({s: 2}, {padding: ['top', 'bottom']})}`}>
            <div className={`${isDatePast(eventTime.range.endDateTime) ? 'font-pewter' : ''}`}>
              <DateRange start={eventTime.range.startDateTime} end={eventTime.range.endDateTime} />
            </div>

            {isDatePast(eventTime.range.endDateTime)
              ? <Fragment>{EventStatus('Past', 'marble')}</Fragment>
              : eventTime.isFullyBooked ? EventStatus('Full', 'red') : null
            }
          </div>
        );
      })}
    </Fragment>
  );
}

function showTicketSalesStart(dateTime) {
  return dateTime && !isTimePast(dateTime);
}

// Convert dates back to Date types because it's serialised through
// `getInitialProps`
function convertJsonToDates(jsonEvent: UiEvent): UiEvent {
  const times = jsonEvent.times.map(time => {
    return {
      ...time,
      range: {
        startDateTime: new Date(time.range.startDateTime),
        endDateTime: new Date(time.range.endDateTime)
      }
    };
  });

  const schedule = jsonEvent.schedule && jsonEvent.schedule.map(item => ({
    ...item,
    event: convertJsonToDates(item.event)
  }));

  return {...jsonEvent, times, schedule};
}

class EventPage extends Component<Props, State> {
  state = {
    scheduledIn: null
  }

  static getInitialProps = async (context: GetInitialPropsProps) => {
    const {id} = context.query;
    const event = await getEvent(context.req, {id});

    if (event) {
      return {
        event,
        title: event.title,
        description: event.promoText,
        type: 'event',
        canonicalUrl: `https://wellcomecollection.org/events/${event.id}`,
        imageUrl: event.image && convertImageUri(event.image.contentUrl, 800),
        siteSection: 'whatson',
        category: 'public-programme',
        pageJsonLd: eventLd(event)
      };
    } else {
      return {statusCode: 404};
    }
  }

  async componentDidMount() {
    const scheduledIn = await getEvents(null, {
      predicates: [
        Prismic.Predicates.at('my.events.schedule.event', this.props.event.id)
      ]
    });

    if (scheduledIn && scheduledIn.results.length > 0) {
      this.setState({
        scheduledIn: scheduledIn.results[0]
      });
    }
  }

  render() {
    const jsonEvent = this.props.event;
    const event = convertJsonToDates(jsonEvent);
    const {scheduledIn} = this.state;

    const image = event.promo && event.promo.image;
    const tasl = image && {
      isFull: false,
      contentUrl: image.contentUrl,
      title: image.title,
      author: image.author,
      sourceName: image.source && image.source.name,
      sourceLink: image.source && image.source.link,
      license: image.license,
      copyrightHolder: image.copyright && image.copyright.holder,
      copyrightLink: image.copyright && image.copyright.link
    };

    const FeaturedMedia = image && <UiImage tasl={tasl} {...image} />;
    const eventFormat = event.format ? [{url: null, text: event.format.title}] : [];
    const eventAudiences = event.audiences ? event.audiences.map(a => {
      return {
        url: null,
        text: a.title
      };
    }) : [];
    const eventInterpretations = event.interpretations ? event.interpretations.map(i => {
      return {
        url: null,
        text: i.interpretationType.title
      };
    }) : [];
    const relaxedPerformanceLabel = event.isRelaxedPerformance ? [{
      url: null,
      text: 'Relaxed performance'
    }] : [];

    const breadcrumbs = {
      items: [
        {
          url: '/events',
          text: 'Events'
        },
        ...event.series.map(series => ({
          url: `/event-series/${series.id}`,
          text: series.title || '',
          prefix: 'Part of'
        })),
        scheduledIn ? {
          url: `/events/${scheduledIn.id}`,
          text: scheduledIn.title || '',
          prefix: 'Part of'
        } : null
      ].filter(Boolean)
    };

    const labels = {
      labels: eventFormat.concat(
        eventAudiences,
        eventInterpretations,
        relaxedPerformanceLabel
      )
    };
    const Header = <PageHeader
      asyncBreadcrumbsRoute={`/events/${event.id}/scheduled-in`}
      breadcrumbs={breadcrumbs}
      labels={labels}
      title={event.title}
      FeaturedMedia={FeaturedMedia}
      Background={<HeaderBackground
        hasWobblyEdge={true}
        backgroundTexture={`https://wellcomecollection.cdn.prismic.io/wellcomecollection%2F43a35689-4923-4451-85d9-1ab866b1826d_event_header_background.svg`} />}
      ContentTypeInfo={
        <Fragment>
          <div className={classNames({
            'flex flex--wrap': true,
            [spacing({s: 1}, {margin: ['bottom']})]: true
          })}>
            {EventDateRange({event})}
            <div className={classNames({
              [spacing({s: 0, m: 2}, {margin: ['left']})]: true
            })}>
              {!event.isPast &&
                <SecondaryLink
                  url='#dates'
                  text={`See all dates`}
                  icon={'arrowSmall'}
                  trackingEvent={{
                    category: 'component',
                    action: 'date-times-jump-link:click',
                    label: event.id
                  }} />
              }
            </div>
          </div>
          {event.isPast && EventStatus('Past', 'marble')}
          {!event.isPast && isEventFullyBooked(event) && EventStatus('Fully booked', 'red')}
        </Fragment>
      }
      HeroPicture={null}
      isFree={!event.cost}
    />;

    return (
      <BasePage
        id={event.id}
        Header={Header}
        Body={<Body body={event.body} />}
      >
        <Fragment>
          {event.contributors.length > 0 &&
            <div className={`${spacing({s: 4}, {margin: ['bottom']})}`}>
              <Contributors
                titlePrefix='About your'
                titleOverride={event.contributorsTitle}
                contributors={event.contributors} />
            </div>
          }

          <div className={spacing({s: 4}, {margin: ['bottom']})}>
            <div className={`body-text border-bottom-width-1 border-color-pumice`}>
              <h2 id='dates'>Dates</h2>
              {DateList(event)}
            </div>
          </div>

          {event.schedule && event.schedule.length > 0 &&
            <div className={spacing({s: 4}, {margin: ['bottom']})}>
              <h2 className='h2'>Events</h2>
              <ul className='plain-list no-marin no-padding'>
                {event.schedule && <EventSchedule schedule={event.schedule} />}
              </ul>
            </div>
          }

          {event.ticketSalesStart && showTicketSalesStart(event.ticketSalesStart) &&
            <div className={spacing({s: 4}, {margin: ['bottom']})}>
              <Message text={`Booking opens ${formatDayDate(event.ticketSalesStart)} ${event.ticketSalesStart ? formatTime(event.ticketSalesStart) : ''}`} />
            </div>
          }

          {!event.isPast && !showTicketSalesStart(event.ticketSalesStart) &&
          <Fragment>
            {event.eventbriteId &&
              <EventbriteButton event={event} />
            }

            {event.bookingEnquiryTeam &&
              <div className={`${spacing({s: 2}, {padding: ['top', 'bottom']})} ${spacing({s: 4}, {margin: ['bottom']})}`}>
                {event.isCompletelySoldOut ? <Button type='primary' disabled={true} text='Fully booked' />
                  : (
                    <Button
                      type='primary'
                      url={`mailto:${event.bookingEnquiryTeam.email}?subject=${event.title}`}
                      trackingEvent={{
                        category: 'component',
                        action: 'booking-tickets:click',
                        label: 'event-page (email to book)'
                      }}
                      icon='email'
                      text='Email to book' />
                  )}
                <SecondaryLink
                  url={`mailto:${event.bookingEnquiryTeam.email}?subject=${event.title}`}
                  text={event.bookingEnquiryTeam.email}
                  extraClasses={`block font-charcoal ${spacing({s: 1}, {margin: ['top']})}`} />
              </div>
            }

            {!event.eventbriteId && !event.bookingEnquiryTeam && !(event.schedule && event.schedule.length > 1) &&
              <div className={spacing({s: 4}, {margin: ['bottom']})}>
                <Message text='Just turn up' />
              </div>
            }
          </Fragment>
          }

          {!event.isPast &&
            <Fragment>
              <InfoBox title='Need to know' items={[
                (event.place && {
                  id: null,
                  title: 'Location',
                  description: event.place.information
                }),
                (event.bookingInformation && {
                  id: null,
                  title: 'Extra information',
                  description: event.bookingInformation
                })
              ]
                .concat(event.policies.map(policy => ({...policy})))
                .concat(event.interpretations.map(({interpretationType, isPrimary}) => ({
                  id: null,
                  icon: camelize(interpretationType.title),
                  title: interpretationType.title,
                  description: isPrimary
                    ? interpretationType.primaryDescription
                    : interpretationType.description
                }))).filter(Boolean)}>
                <p className={`plain-text no-margin ${font({s: 'HNL4'})}`}>
                  <a href='https://wellcomecollection.org/visit-us/events-tickets'>Our event terms and conditions</a>
                </p>
              </InfoBox>
            </Fragment>
          }

          {event.audiences.map((audience) => { //  TODO remove?
            if (audience.description) {
              return (
                <div className={`body-text ${spacing({s: 4}, {margin: ['bottom']})}`} key={audience.title}>
                  <h2>For {audience.title}</h2>
                  <PrismicHtmlBlock html={audience.description} />
                </div>
              );
            }
          })}

        </Fragment>
      </BasePage>
    );
  }
}

export default PageWrapper(EventPage);
