// @flow
import {Fragment} from 'react';
import BasePage from './BasePage';
import Body from '../Body/Body';
import Contributors from '../Contributors/Contributors';
import EventSchedule from '../EventSchedule/EventSchedule';
import Icon from '../Icon/Icon';
import Button from '../Buttons/Button/Button';
import EventbriteButton from '../EventbriteButton/EventbriteButton';
import SecondaryLink from '../Links/SecondaryLink/SecondaryLink';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import InfoBox from '../InfoBox/InfoBox';
import {UiImage} from '../Images/Images';
import type {UiEvent} from '../../../model/events';
import {spacing, font, classNames} from '../../../utils/classnames';
import camelize from '../../../utils/camelize';
import {
  formatAndDedupeOnDate,
  formatAndDedupeOnTime,
  joinDateStrings,
  formatDayDate,
  isTimePast,
  formatTime
} from '../../../utils/format-date';
import EventDateRange from '../EventDateRange/EventDateRange';
import HeaderBackground from '../BaseHeader/HeaderBackground';
import PageHeader from '../PageHeader/PageHeader';

type Props = {|
  event: UiEvent
|}

function eventStatus(text, color) {
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
        const formattedDateRange = formatAndDedupeOnDate(eventTime.range.startDateTime, eventTime.range.endDateTime);

        return (
          <div key={index} className={`flex flex--h-space-between border-top-width-1 border-color-pumice ${spacing({s: 2}, {padding: ['top', 'bottom']})}`}>
            <div className={`${event.isPast ? 'font-pewter' : ''}`}>
              <time>{joinDateStrings(formattedDateRange)}</time>, <time>{joinDateStrings(formatAndDedupeOnTime(eventTime.range.startDateTime, eventTime.range.endDateTime))}</time>
            </div>

            {event.isPast
              ? <Fragment>{eventStatus('Past', 'marble')}</Fragment>
              : <Fragment>
                {(eventTime.isFullyBooked && !(event.eventbriteId || event.bookingEnquiryTeam))/* TODO: || isEventTimeFullyBookedAtEventbrite */
                  ? <Fragment>{eventStatus('Full', 'red')}</Fragment>
                  : <Fragment>{/* {eventStatus('Available', 'green')} */}</Fragment>
                }
              </Fragment>
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

const EventPage = ({ event }: Props) => {
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
    items: [{
      url: '/events',
      text: 'Events'
    }].concat(event.series.map(series => ({
      url: `/event-series/${series.id}`,
      text: series.title || '',
      prefix: 'Part of'
    })))
  };
  const labels = {
    labels: eventFormat.concat(
      eventAudiences,
      eventInterpretations,
      relaxedPerformanceLabel
    )
  };
  const Header = <PageHeader
    breadcrumbs={breadcrumbs}
    labels={labels}
    title={event.title}
    FeaturedMedia={FeaturedMedia}
    Background={<HeaderBackground
      hasWobblyEdge={true}
      backgroundTexture={`https://wellcomecollection.cdn.prismic.io/wellcomecollection%2F43a35689-4923-4451-85d9-1ab866b1826d_event_header_background.svg`} />}
    ContentTypeInfo={
      <div className='flex flex--wrap'>
        <div>
          {EventDateRange({event})}
        </div>
        <div className={classNames({
          [spacing({s: 0, m: 2}, {margin: ['left']})]: true
        })}>
          {event.isPast
            ? <Fragment>{eventStatus('Past', 'marble')}</Fragment>
            : <SecondaryLink
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
    }
    HeroPicture={null}
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
              {event.schedule && <EventSchedule events={event.schedule} />}
            </ul>
          </div>
        }

        {event.ticketSalesStart && showTicketSalesStart(event.ticketSalesStart) &&
          <Fragment>
            <div className={`bg-yellow inline-block ${spacing({s: 4}, {padding: ['left', 'right'], margin: ['bottom']})} ${spacing({s: 2}, {padding: ['top', 'bottom']})} ${font({s: 'HNM4'})}`}>
              {/* TODO: work out why the second method below will fail Flow without a null check */}
              <span>Booking opens {formatDayDate(event.ticketSalesStart)} {event.ticketSalesStart && formatTime(event.ticketSalesStart)}</span>
            </div>
          </Fragment>
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

            {(!event.eventbriteId && !event.bookingEnquiryTeam) &&
              <Fragment>
                <div className={`bg-yellow inline-block ${spacing({s: 4}, {padding: ['left', 'right'], margin: ['bottom']})} ${spacing({s: 2}, {padding: ['top', 'bottom']})} ${font({s: 'HNM4'})}`}>
                  <span>Just turn up</span>
                </div>
              </Fragment>
            }
          </Fragment>
        }

        {!event.isPast &&
          <Fragment>
            <InfoBox title='Need to know' items={[
              (event.place && {
                title: 'Location',
                description: event.place.information
              }),
              (event.bookingInformation && {
                title: 'Extra information',
                description: event.bookingInformation
              })
            ]
              .concat(event.policies.map(policy => ({...policy})))
              .concat(event.interpretations.map(({interpretationType, isPrimary}) => ({
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
};

export default EventPage;
