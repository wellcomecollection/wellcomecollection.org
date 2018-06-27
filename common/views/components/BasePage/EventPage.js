// @flow
import {Fragment} from 'react';
import BasePage from './BasePage';
import BaseHeader from '../BaseHeader/BaseHeader';
import Body from '../Body/Body';
import Contributors from '../Contributors/Contributors';
import WobblyBackground from '../BaseHeader/WobblyBackground';
import EventScheduleItem from '../EventScheduleItem/EventScheduleItem';
import Tags from '../Tags/Tags';
import Icon from '../Icon/Icon';
import Button from '../Buttons/Button/Button';
import {UiImage} from '../Images/Images';
import type {Event} from '../../../model/events';
import {spacing, font} from '../../../utils/classnames';
import camelize from '../../../utils/camelize';
import {formatAndDedupeOnDate, formatAndDedupeOnTime, joinDateStrings} from '../../../utils/format-date';

type Props = {|
  event: Event
|}

function DateInfo(event) {
  return (
    event.times && <Fragment>
      {event.times.map((eventTime, index) => {
        const formattedDateRange =  formatAndDedupeOnDate(eventTime.range.startDateTime, eventTime.range.endDateTime);
        return (
          <div key={index} className={`border-top-width-1 border-color-pumice ${spacing({s: 2}, {padding: ['top', 'bottom']})}`}>
            <time className='block'>
              <b className={font({s: 'HNM4'})}>{joinDateStrings(formattedDateRange)}</b>
            </time>
            {formattedDateRange.length === 1 && (
              <div className='flex'>
                <time className='block'>
                  {joinDateStrings(formatAndDedupeOnTime(eventTime.range.startDateTime, eventTime.range.endDateTime))}
                </time>
                {/* TODO - refactor StatusIndicator so it can be used here too */}
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

const BookingInfo = ({bookingInformation, interpretations}: any) => ( // TODO props
  <div className='body-text'>
    {interpretations.map((i) => {
      return (i.interpretationType.description &&
        <Fragment key={i.interpretationType.title}>
          <h2 className='flex flex--v-center'>
            <span className={`flex flex--v-center ${spacing({s: 1}, {margin: ['right']})}`}>
              <Icon name={camelize(i.interpretationType.title)} />
            </span>
            <span>{i.interpretationType.title}</span>
          </h2>
          {i.isPrimary && <div dangerouslySetInnerHTML={{__html: i.interpretationType.primaryDescription}} />}
          {!i.isPrimary && <div dangerouslySetInnerHTML={{__html: i.interpretationType.description}} />}
        </Fragment>
      );
    })}
    {bookingInformation &&
      <Fragment>
        <h3 className={font({s: 'HNM4'})}>Booking information</h3>
        <div className={`plain-text ${font({s: 'HNL4'})} ${spacing({s: 4}, {margin: ['bottom']})}`} dangerouslySetInnerHTML={{__html: bookingInformation}} />
      </Fragment>}
    <p className={`plain-text no-margin ${font({s: 'HNL4'})}`}>
      <a href='https://wellcomecollection.org/visit-us/events-tickets'>Our event terms and conditions</a>
    </p>
  </div>
);

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
  const formatTag = event.format ? [{text: event.format.title + audiencesString(event.audiences)}] : [];
  const interpretationsTags = event.interpretations ? event.interpretations.map(i => ({text: i.interpretationType.title})) : [];
  const TagBar = <Tags tags={formatTag.concat(interpretationsTags)} />;
  function audiencesString(audiences) {
    if (audiences.length > 0) {
      return audiences.reduce((acc, audience, i) => {
        if (i === 0) {
          return acc + ` for ${audience.title}`;
        } else if (i + 1 === audiences.length) {
          return acc + `and ${audience.title}`;
        } else {
          return acc + `, ${audience.title}`;
        }
      }, '');
    } else {
      return '';
    }
  }
  const Header = (<BaseHeader
    title={event.title}
    Background={WobblyBackground()}
    TagBar={TagBar}
    DateInfo={DateInfo(event)}
    InfoBar={InfoBar(event.cost, event.eventbriteId, event.bookingEnquiryTeam)}
    Description={null}
    FeaturedMedia={FeaturedMedia}
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

        {event.series.map((series) => {
          return (
            <div className='body-text' key={series.id}>
              <h2>Part of <a href='/event-series/{series.id}'>{series.title}</a></h2>
              <div dangerouslySetInnerHTML={{__html: series.description}} />
            </div>
          );
        })}

        {/* Booking sections */
          event.eventbriteId &&
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

        {event.contributors.length > 0 &&
          <Contributors
            titlePrefix='About your'
            contributors={event.contributors} />
        }

        <BookingInfo bookingInformation={event.bookingInformation} interpretations={event.interpretations} />

      </Fragment>
    </BasePage>
  );
};

export default EventPage;
