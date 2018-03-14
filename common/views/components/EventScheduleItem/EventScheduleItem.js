// @flow

import {grid, font, spacing} from '../../../utils/classnames';
import Icon from '../Icon/Icon';
import MoreInfoLink from '../MoreInfoLink/MoreInfoLink';
import ButtonButton from '../Buttons/ButtonButton/ButtonButton';
import camelize from '../../../utils/camelize';
import {formatTime} from '../../../utils/format-date';

type Props = {|
  event: any, // TODO: type event
  eventInfo: any // TODO: type eventInfo
|}

function getTicketInfo(event, eventInfo) {
  if (event.isDropIn) {
    return 'Drop in';
  } else if (event.cost) {
    return 'Guaranteed entry';
  } else if (eventInfo.eventbriteId && !eventInfo.isCompletelySoldOut) {
    return 'First come, first seated';
  } else if (event.bookingEnquiryTeam) {

  } else {
    return 'Ticketed';
  }
}

function getTicketButton(eventInfo) {
  if (!eventInfo.eventbriteId) return;

  if (eventInfo.isCompletelySoldOut) {
    return (
      <ButtonButton
        disabled
        aria-disabled='true'
        text='Fully booked'
        icon='ticketAvailable'
        extraClasses={`${font({s: 'HNM5'})} btn--full-width-s ${spacing({s: 2}, {margin: ['bottom']})}`}
      />
    );
  } else {
    return (
      <div className="js-eventbrite-ticket-button" data-eventbrite-ticket-id={eventInfo.eventbriteId}>
        <a className={`flex-inline flex--v-center flex--h-center btn btn--full-width-s ${font({s: 'HNM4'})} ${spacing({s: 2}, {margin: ['bottom']})}`}
          href={`https://www.eventbrite.com/e/${eventInfo.eventbriteId}/`}>
          <span><Icon name='ticketAvailable' /></span>
          <span className="js-eventbrite-ticket-button-text">Book free tickets</span>
        </a>
      </div>
    );
  }
}

const EventScheduleItem = ({event, eventInfo}: Props) => (
  <li className={`event-schedule__item ${spacing({s: 2, l: 0}, {padding: ['left']})} ${spacing({s: 4}, {margin: ['bottom']})}`}>
    <div className='grid'>
      <div className={`${grid({s: 12, m: 12, l: 2, xl: 2})} ${spacing({s: 2, l: 0}, {margin: ['bottom']})} font-purple`}>
        {event.times.map((t) => {
          const startTimeString = t.range.startDateTime.toString();
          const endTimeString = t.range.endDateTime.toString();
          return (
            <p key={event.title + startTimeString}>
              <time dateTime={startTimeString}>{formatTime(t.range.startDateTime)}</time>&mdash;<time dateTime={endTimeString}>{formatTime(t.range.endDateTime)}</time>
            </p>
          );
        })}
      </div>
      <div className={grid({s: 12, m: 12, l: 7, xl: 7})}>
        {event.format &&
          <span className={`block ${font({s: 'HNM5', m: 'HNM4'})} ${spacing({s: 1}, {margin: ['bottom']})}`}>{event.format.title}</span>
        }
        <h3 className={`${font({s: 'WB7', m: 'WB6'})} ${spacing({s: 0}, {margin: ['top']})} ${spacing({s: 1}, {margin: ['bottom']})}`}>{event.title}</h3>
      </div>
      <div className={`${grid({s: 12, m: 12, l: 3, xl: 3})} ${spacing({s: 2}, {margin: ['top']})} ${spacing({l: 0}, {margin: ['top']})}`}>
        <div className='event-schedule__meta flex flex-end'>
          <div className="event-schedule__tickets">
            {event.isDropIn &&
              <div className={`${spacing({s: 1}, {margin: ['right', 'bottom']})} ${font({s: 'HNM5', m: 'HNM4'})}`}>No ticket required</div>
            }
            <div className={`${spacing({s: 1}, {margin: ['right', 'bottom']})} ${font({s: 'HNM5', m: 'HNM4'})}`}>{getTicketInfo(event, eventInfo)}</div>
            {event.interpretations.map(interpretation => (
              <Icon key={interpretation.interpretationType.title}
                title={interpretation.interpretationType.title}
                name={camelize(interpretation.interpretationType.title)} />
            ))}
          </div>
        </div>
      </div>
    </div>
    <div className='grid'>
      <div className={`${grid({s: 12, m: 12, l: 2, xl: 2})} ${spacing({s: 2, l: 0}, {margin: ['bottom']})}`}></div>
      <div className={grid({s: 12, m: 12, l: 7, xl: 7})}>
        <div>
          <p className={`${spacing({s: 3}, {margin: ['top']})} ${spacing({s: 2}, {margin: ['bottom']})}`} dangerouslySetInnerHTML={{__html: event.description}} />

          <div className={spacing({s: 4}, {margin: ['bottom']})}>
            <MoreInfoLink url={`/events/${event.id}`} name='More information' />
          </div>

          {getTicketButton(eventInfo)}
        </div>
      </div>
    </div>
  </li>
);

export default EventScheduleItem;
