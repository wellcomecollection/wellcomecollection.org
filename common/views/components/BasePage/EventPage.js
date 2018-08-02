// @flow
import {Fragment} from 'react';
import BasePage from './BasePage';
import BaseHeader from '../BaseHeader/BaseHeader';
import Body from '../Body/Body';
import Contributors from '../Contributors/Contributors';
import WobblyBackground from '../BaseHeader/WobblyBackground';
import PrimaryLink from '../Links/PrimaryLink/PrimaryLink';
import EventScheduleItem from '../EventScheduleItem/EventScheduleItem';
import Labels from '../Labels/Labels';
import Icon from '../Icon/Icon';
import Button from '../Buttons/Button/Button';
import SecondaryLink from '../Links/SecondaryLink/SecondaryLink';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import {UiImage} from '../Images/Images';
import type {UiEvent} from '../../../model/events';
import {spacing, font} from '../../../utils/classnames';
import camelize from '../../../utils/camelize';
import {formatAndDedupeOnDate, formatAndDedupeOnTime, joinDateStrings, formatDayDate, isDatePast, formatTime} from '../../../utils/format-date';

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

function DateInfo(event) {
  return (
    event.times && <Fragment>
      {event.times.map((eventTime, index) => {
        const formattedDateRange = formatAndDedupeOnDate(eventTime.range.startDateTime, eventTime.range.endDateTime);

        return (
          <div key={index} className={`flex flex--h-space-between border-top-width-1 border-color-pumice ${spacing({s: 2}, {padding: ['top', 'bottom']})}`}>
            <div className={`${isDatePast(eventTime.range.endDateTime) ? 'font-pewter' : ''}`}>
              <time>{joinDateStrings(formattedDateRange)}</time>, <time>{joinDateStrings(formatAndDedupeOnTime(eventTime.range.startDateTime, eventTime.range.endDateTime))}</time>
            </div>

            {isDatePast(eventTime.range.endDateTime)
              ? <Fragment>{eventStatus('Past', 'marble')}</Fragment>
              : <Fragment>
                {(eventTime.isFullyBooked /* TODO: || isEventTimeFullyBookedAtEventbrite */)
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

function infoBar(event) {
  const { eventbriteId, bookingEnquiryTeam } = event;

  return (
    <Fragment>
      {isDatePast(event.dateRange.lastDate)
        ? <Fragment>{eventStatus('Past', 'marble')}</Fragment>
        : <PrimaryLink url='#dates' name={`See all dates/times${(eventbriteId || bookingEnquiryTeam) ? ' to book' : ''}`} isJumpLink={true} />
      }
    </Fragment>
  );
}

function topDate(event) {
  // Displays the closest future date, or the first date if _all_
  // dates are in the past
  const dayAndDate = formatDayDate(event.upcomingDate.startDateTime);
  const startTime = formatTime(event.upcomingDate.startDateTime);
  const endTime = formatTime(event.upcomingDate.endDateTime);

  return (
    <Fragment>
      <time>{dayAndDate}</time>,{' '}
      <time>{joinDateStrings([startTime, endTime])}</time>
    </Fragment>
  );
};

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
  /* https://github.com/facebook/flow/issues/2405 */
  /* $FlowFixMe */
  const FeaturedMedia = event.promo && <UiImage tasl={tasl} {...image} />;
  const eventFormat = event.format ? [event.format.title] : [];
  const eventAudiences = event.audiences ? event.audiences.map(a => a.title) : [];
  const eventInterpretations = event.interpretations ? event.interpretations.map(i => (i.interpretationType.title)) : [];

  const Header = (<BaseHeader
    title={`${event.title}`}
    Background={<WobblyBackground />}
    TagBar={null}
    LabelBar={<Labels labels={(eventFormat.concat(eventAudiences, eventInterpretations))} isSpaced={true} />}
    DateInfo={topDate(event)}
    InfoBar={infoBar(event)}
    Description={null}
    FeaturedMedia={FeaturedMedia}
    isFree={Boolean(!event.cost)}
    topLink={{text: 'Events', url: '/events'}}
  />);

  return (
    <BasePage
      id={event.id}
      Header={Header}
      Body={<Body body={event.body} />}
    >
      <Fragment>
        {event.schedule && event.schedule.length > 0 &&
          <div>
            <h2 className={`${font({s: 'WB6', l: 'WB5'})} ${spacing({s: 4}, {padding: ['bottom']})} border-color-smoke border-bottom-width-2`}>Events</h2>
            <ul className='plain-list no-marin no-padding'>
              {event.schedule && event.schedule.map((scheduledEvent) => {
                return (<EventScheduleItem key={scheduledEvent.id} event={Object.assign({}, scheduledEvent, {description: scheduledEvent.promo && scheduledEvent.promo.caption})}
                  hasOwnPage={Boolean(scheduledEvent.description)} />);
              })}
            </ul>
          </div>
        }

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
            {DateInfo(event)}
          </div>
        </div>

        {!isDatePast(event.dateRange.lastDate) &&
          <Fragment>
            {/* Booking CTAs */}
            {event.eventbriteId &&
              <div>
                {event.isCompletelySoldOut ? <Button type='primary' disabled={true} text='Fully booked' />
                  : (
                    <div className='js-eventbrite-ticket-button' data-eventbrite-ticket-id={event.eventbriteId}>
                      <Button
                        type='primary'
                        url={`https://www.eventbrite.com/e/${event.eventbriteId}/`}
                        eventTracking={JSON.stringify({
                          category: 'component',
                          action: 'booking-tickets:click',
                          label: 'event-page'
                        })}
                        icon='ticket'
                        text='Book free tickets' />
                      <p className={`font-charcoal ${font({s: 'HNL5'})} ${spacing({s: 1}, {margin: ['top']})} ${spacing({s: 0}, {margin: ['bottom']})}`}>with Eventbrite</p>
                    </div>
                  )
                }
              </div>
            }

            {event.bookingEnquiryTeam &&
              <div className={`${spacing({s: 2}, {padding: ['top', 'bottom']})}`}>
                {event.isCompletelySoldOut ? <Button type='primary' disabled={true} text='Fully booked' />
                  : (
                    <Button
                      type='primary'
                      url={`mailto:${event.bookingEnquiryTeam.email}?subject=${event.title}`}
                      eventTracking={JSON.stringify({
                        category: 'component',
                        action: 'booking-tickets:click',
                        label: 'event-page (email to book)'
                      })}
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
                <div className={`bg-yellow inline-block ${spacing({s: 4}, {padding: ['left', 'right'], margin: ['top', 'bottom']})} ${spacing({s: 2}, {padding: ['top', 'bottom']})} ${font({s: 'HNM4'})}`}>
                  <span>Just turn up</span>
                </div>
              </Fragment>
            }
          </Fragment>
        }

        <div className={`bg-yellow ${spacing({s: 4}, {padding: ['top', 'right', 'bottom', 'left']})} ${spacing({s: 4}, {margin: ['top', 'bottom']})}`}>
          <h2 className='h2'>Need to know</h2>
          {event.place &&
            <Fragment>
              <h3 className={`${font({s: 'HNM4'})} no-margin`}>Location</h3>
              <div className={`plain-text ${font({s: 'HNL4'})} ${spacing({s: 2}, {margin: ['bottom']})}`}>
                <p>{event.place && event.place.title && `We'll be in the ${event.place.title}. ${(event.place && event.place.information) ? event.place.information : ''}`}</p>
              </div>
            </Fragment>
          }
          {event.bookingInformation && event.bookingInformation.length > 0 &&
            <Fragment>
              <h3 className={font({s: 'HNM4'})}>Booking information</h3>
              <div className={`plain-text ${font({s: 'HNL4'})} ${spacing({s: 4}, {margin: ['bottom']})}`}>
                <PrismicHtmlBlock html={event.bookingInformation} />
              </div>
            </Fragment>
          }

          {
            event.isDropIn ? (
              <Fragment>
                <h3 className={`${font({s: 'HNM4'})} no-margin`}>Drop in at any time</h3>
                <div className={`plain-text ${font({s: 'HNL4'})} ${spacing({s: 2}, {margin: ['bottom']})}`}>
                  <p>
                    We programme some drop-in events every month. For these events, you can just turn up. There&apos;s usually room for everyone.
                  </p>
                </div>
              </Fragment>
            )
              : event.cost ? (
                <Fragment>
                  <h3 className={`${font({s: 'HNM4'})} no-margin`}>Guaranteed entry</h3>
                  <div className={`plain-text ${font({s: 'HNL4'})} ${spacing({s: 2}, {margin: ['bottom']})}`}>
                    <p>
                  With our paid events, you are guaranteed entry to the event.
                  We&apos;re unable to offer any refunds unless the event is cancelled.
                  Concessions are available for people over 60, students, people
                  on Jobseeker&apos;s Allowance and people registered as disabled.
                  An additional companion ticket for people registered as disabled
                  is available for free.
                    </p>
                  </div>
                </Fragment>
              )
                : event.eventbriteId && !event.isCompletelySoldOut ? (
                  <Fragment>
                    <h3 className={`${font({s: 'HNM4'})} no-margin`}>First come, first seated</h3>
                    <div className={`plain-text ${font({s: 'HNL4'})} ${spacing({s: 2}, {margin: ['bottom']})}`}>
                      <p>
                      Please note, booking a ticket for a free event does not
                  guarantee a place on the day. Doors usually open 15 minutes
                  before an event starts, and you can take your seats in order of
                  arrival. We advise arriving 10 minutes before the event is
                  scheduled to start.
                      </p>
                      <p>
                We hold some spaces for people with access requirements.
                Please email <a href={`mailto:access@wellcomecollection.org?subject=${event.title}`}>access@wellcomecollection.org</a> if you would like to request one of these spaces.
                      </p>
                    </div>
                  </Fragment>
                )
                  : event.bookingEnquiryTeam ? null
                    : (
                      <Fragment>
                        <h3 className={`${font({s: 'HNM4'})} no-margin`}>Limited spaces available</h3>
                        <div className={`plain-text ${font({s: 'HNL4'})} ${spacing({s: 2}, {margin: ['bottom']})}`}>
                          <p>
                    Doors will open for this event 15 minutes before the event
                    starts. Spaces are first come, first served and may run out if
                    we are busy.
                          </p>
                        </div>
                      </Fragment>
                    )
          }

          {event.interpretations.map((i) => {
            return (i.interpretationType.description &&
              <Fragment key={i.interpretationType.title}>
                <div className={`${spacing({s: 4}, {margin: ['bottom']})}`}>
                  <h3 className={`${font({s: 'HNM4'})} no-margin flex flex--v-center'`}>
                    <span className={`flex flex--v-center ${spacing({s: 1}, {margin: ['right']})}`}>
                      <Icon name={camelize(i.interpretationType.title)} />
                    </span>
                    <span>{i.interpretationType.title}</span>
                  </h3>
                  <div className={`plain-text ${font({s: 'HNL4'})} ${spacing({s: 2}, {margin: ['bottom']})}`}>
                    {i.isPrimary && <PrismicHtmlBlock html={i.interpretationType.primaryDescription} />}
                    {!i.isPrimary && <PrismicHtmlBlock html={i.interpretationType.description} />}
                  </div>
                </div>
              </Fragment>
            );
          })}

          <p className={`plain-text no-margin ${font({s: 'HNL4'})}`}>
            <a href='https://wellcomecollection.org/visit-us/events-tickets'>Our event terms and conditions</a>
          </p>
        </div>

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

        {event.series.map((series) => {
          return (
            <div className={`body-text ${spacing({s: 4}, {margin: ['bottom']})}`} key={series.id}>
              <h2>Part of <a href='/event-series/{series.id}'>{series.title}</a></h2>
              <PrismicHtmlBlock html={series.description} />
            </div>
          );
        })}

      </Fragment>
    </BasePage>
  );
};

export default EventPage;
