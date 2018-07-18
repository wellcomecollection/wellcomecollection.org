// @flow
import {Fragment} from 'react';
import BasePage from './BasePage';
import BaseHeader from '../BaseHeader/BaseHeader';
import Body from '../Body/Body';
import Contributors from '../Contributors/Contributors';
import WobblyBackground from '../BaseHeader/WobblyBackground';
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
import {formatAndDedupeOnDate, formatAndDedupeOnTime, joinDateStrings, formatDayDate} from '../../../utils/format-date';

type Props = {|
  event: UiEvent
  |}

function DateInfo(event) {
  return (
    event.times && <Fragment>
      {event.times.map((eventTime, index) => {
        const formattedDateRange =  formatAndDedupeOnDate(eventTime.range.startDateTime, eventTime.range.endDateTime);
        return (
          <div key={index} className={`border-top-width-1 border-color-pumice ${spacing({s: 2}, {padding: ['top', 'bottom']})}`}>
            <time>{joinDateStrings(formattedDateRange)}</time>, <time>{joinDateStrings(formatAndDedupeOnTime(eventTime.range.startDateTime, eventTime.range.endDateTime))}</time>
            {formattedDateRange.length === 1 && (
              <div className='flex'>
                {(eventTime.isFullyBooked && !(event.eventbriteId || event.bookingEnquiryTeam)) &&
                  <div className={`${font({s: 'HNM5'})} ${spacing({s: 2}, {margin: ['left']})} flex flex--v-center`}>
                    <span className={`${spacing({s: 1}, {margin: ['right']})} flex flex--v-center`}>
                      <Icon name='statusIndicator' extraClasses={`icon--match-text icon--red`} />
                    </span>
                    Fully booked
                  </div>
                }
              </div>
            )}
          </div>
        );
      })}
    </Fragment>
  );
}

function InfoBar(cost, eventbriteId, bookingEnquiryTeam) {
  return (
    <p className='no-margin'>
      {cost || 'Free admission'}
      <span className={`border-left-width-1 border-color-pumice ${spacing({s: 1}, {padding: ['left'], margin: ['left']})}`}>
        {eventbriteId ? 'Ticketed'
          : bookingEnquiryTeam ? 'Enquire to book'
            : 'No ticket required'}
      </span>
    </p>
  );
}

function DatesShowHide(event) {
  return (
    <div>
      {event.selectedDate ? formatDayDate(event.selectedDate) : event.upcomingDate && formatDayDate(event.upcomingDate)}
      {event.times && event.times.length > 1 &&
        <Fragment>
          <div className='js-show-hide drawer inline'>
            <a
              className={[
                'primary-link',
                'flex-inline',
                'flex-v-center',
                'plain-link',
                'js-show-hide-trigger',
                spacing({s: 2}, {margin: ['left']}),
                font({s: 'HNM4'})].join(' ')} href={'#'}>More dates
              <Icon name='chevron' extraClasses='icon--green' />
            </a>
            <div className={`js-show-hide-drawer drawer__body ${spacing({s: 2}, {padding: ['top']})}`}>
              {DateInfo(event)}
            </div>
          </div>
          {event.eventbriteId &&
            <div className={`border-top-width-1 border-color-pumice ${spacing({s: 2}, {padding: ['top', 'bottom']})} ${spacing({s: 2}, {margin: ['top']})}`}>
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
        </Fragment>
      }

      {event.bookingEnquiryTeam &&
        <div className={`border-top-width-1 border-color-pumice ${spacing({s: 2}, {padding: ['top', 'bottom']})}`}>
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
    </div>
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
    LabelBar={<Labels labels={(eventFormat.concat(eventAudiences, eventInterpretations))} />}
    DateInfo={DatesShowHide(event)}
    InfoBar={InfoBar(event.cost, event.eventbriteId, event.bookingEnquiryTeam)}
    Description={null}
    FeaturedMedia={FeaturedMedia}
    isFree={Boolean(!event.cost)}
  />);

  return (
    <BasePage
      id={event.id}
      Header={Header}
      Body={<Body body={event.body} />}
    >
      <Fragment>
        {event.schedule && event.schedule.length > 0 &&
          <div className='body-text'>
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
          <div className={`body-text ${spacing({s: 4}, {margin: ['bottom']})}`}>
            <Contributors
              titlePrefix='About your'
              titleOverride={event.contributorsTitle}
              contributors={event.contributors} />
          </div>
        }

        <div className={`body-text ${spacing({s: 4}, {padding: ['bottom']})}`}>
          <h2>Dates</h2>
          {DateInfo(event)}
        </div>

        {/* Booking CTAs */}
        {event.eventbriteId &&
          <div className={`border-top-width-1 border-color-pumice ${spacing({s: 2}, {padding: ['top', 'bottom']})}`}>
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
          <div className={`border-top-width-1 border-color-pumice ${spacing({s: 2}, {padding: ['top', 'bottom']})}`}>
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

        <div className={`bg-yellow ${spacing({s: 4}, {padding: ['top', 'right', 'bottom', 'left']})} ${spacing({s: 4}, {margin: ['bottom']})}`}>
          <h2 className='h2'>Need to know</h2>
          {event.place &&
            <Fragment>
              <h3 className={`${font({s: 'HNM4'})} no-margin`}>Location</h3>
              <div className={`plain-text ${font({s: 'HNL4'})} ${spacing({s: 2}, {margin: ['bottom']})}`}>
                {event.place.information &&
                  <p>{event.place.information}</p>
                }
                {!event.place.information &&
                  <p>{event.place.title} {(event.place.level && `on level ${event.place.level}`)}</p>
                }
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

          <p className={`plain-text no-margin ${font({s: 'HNL4'})}`}>
            <a href='https://wellcomecollection.org/visit-us/events-tickets'>Our event terms and conditions</a>
          </p>
        </div>

        <div className={`body-text ${spacing({s: 4}, {margin: ['bottom']})}`}>
          {event.bookingInformation &&
            <Fragment>
              <h3 className={font({s: 'HNM4'})}>Booking information</h3>
              <div className={`plain-text ${font({s: 'HNL4'})} ${spacing({s: 4}, {margin: ['bottom']})}`}>
                <PrismicHtmlBlock html={event.bookingInformation} />
              </div>
            </Fragment>}
        </div>

        {event.interpretations.map((i) => {
          return (i.interpretationType.description &&
            <div className={`body-text ${spacing({s: 4}, {margin: ['bottom']})}`} key={i.interpretationType.title}>
              <h2 className='flex flex--v-center'>
                <span className={`flex flex--v-center ${spacing({s: 1}, {margin: ['right']})}`}>
                  <Icon name={camelize(i.interpretationType.title)} />
                </span>
                <span>{i.interpretationType.title}</span>
              </h2>
              {i.isPrimary && <PrismicHtmlBlock html={i.interpretationType.primaryDescription} />}
              {!i.isPrimary && <PrismicHtmlBlock html={i.interpretationType.description} />}
            </div>
          );
        })}

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
