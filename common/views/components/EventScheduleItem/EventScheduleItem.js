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

function getTicketButton(eventInfo) {
  if (!eventInfo.eventbriteId) return;

  if (eventInfo.isCompletelySoldOut) {
    return (
      <ButtonButton
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
  <li className={`event-schedule__item ${spacing({l: 0}, {padding: ['left']})} ${spacing({s: 4}, {margin: ['bottom']})} border-color-smoke border-bottom-width-2`}>
    <div className='grid'>
      <div className={`${grid({s: 12, m: 12, l: 2, xl: 2})} ${spacing({s: 2, l: 0}, {margin: ['bottom']})}`}>
        {event.times.map((t) => {
          const startTimeString = t.range.startDateTime.toString();
          const endTimeString = t.range.endDateTime.toString();
          return (
            <p key={event.title + startTimeString} className={`${font({s: 'HNM4'})} no-margin`}>
              <time dateTime={startTimeString}>{formatTime(t.range.startDateTime)}</time>&mdash;<time dateTime={endTimeString}>{formatTime(t.range.endDateTime)}</time>
            </p>
          );
        })}
        <p className={`no-margin ${font({s: 'HNL4'})}`}>{event.place.title}</p>
      </div>
      <div className={`${grid({s: 12, m: 12, l: 7, xl: 7})}`}>
        <div className={`event-schedule__main ${spacing({l: 2}, {margin: ['bottom'], padding: ['right']})}`}>
          {event.format &&
            <span className={`caps font-pewter block ${font({s: 'WB7'})} ${spacing({s: 1}, {margin: ['bottom']})}`}>{event.format.title}</span>
          }
          <h3 className={`${font({s: 'WB7', m: 'WB6'})} ${spacing({s: 0}, {margin: ['top']})} ${spacing({s: 1}, {margin: ['bottom']})}`}>{event.title}</h3>

          <p className={`${spacing({s: 3}, {margin: ['top']})} ${spacing({s: 2}, {margin: ['bottom']})}`} dangerouslySetInnerHTML={{__html: event.description}} />

          <div className={spacing({s: 4}, {margin: ['bottom']})}>
            <MoreInfoLink url={`/events/${event.id}`} name='More information' />
          </div>

          {getTicketButton(eventInfo)}
        </div>
      </div>
      <div className={`${grid({s: 12, m: 12, l: 3, xl: 3})} ${spacing({s: 2, l: 0}, {margin: ['top']})} ${spacing({s: 4, l: 0}, {margin: ['bottom']})}`}>
        <div className='event-schedule__meta flex'>
          <div className="event-schedule__tickets">
            <div className={`${spacing({s: 1}, {margin: ['bottom']})} ${font({s: 'HNM5', m: 'HNM4'})} flex flex--v-center`}>
              <Icon name='ticket' />
              <span className={spacing({s: 1}, {margin: ['left']})}>
                {event.isDropIn
                  ? 'no ticket required'
                  : 'ticketed'
                }
              </span>
            </div>
            {event.interpretations.map(interpretation => (
              <Icon key={interpretation.interpretationType.title}
                title={interpretation.interpretationType.title}
                name={camelize(interpretation.interpretationType.title)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  </li>
);

export default EventScheduleItem;
