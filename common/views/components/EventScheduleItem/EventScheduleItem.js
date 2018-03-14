// @flow

import {grid, font, spacing} from '../../../utils/classnames';
import Icon from '../Icon/Icon';
import MoreInfoLink from '../MoreInfoLink/MoreInfoLink';
import EventBookingButton from '../EventBookingButton/EventBookingButton';
import camelize from '../../../utils/camelize';
import {formatTime} from '../../../utils/format-date';

type Props = {|
  event: Event, // TODO: type event
|}

function getTicketedMarkup(event) {
  if (event.eventInfo.eventbriteId) {
    return 'Ticketed';
  } else if (event.bookingEnquiryTeam) {
    return 'Enquire to book';
  } else {
    return 'No ticket required';
  }
}

const EventScheduleItem = ({event}: Props) => (
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

          <EventBookingButton event={event} />
        </div>
      </div>
      <div className={`${grid({s: 12, m: 12, l: 3, xl: 3})} ${spacing({s: 2, l: 0}, {margin: ['top']})} ${spacing({s: 4, l: 0}, {margin: ['bottom']})}`}>
        <div className='event-schedule__meta flex'>
          <div className='event-schedule__tickets'>
            <div className={`${spacing({s: 1}, {margin: ['bottom']})} ${font({s: 'HNM5', m: 'HNM4'})}`}>
              <span className={spacing({s: 1}, {margin: ['left']})}>
                <span className={`block ${spacing({s: 2}, {margin: ['bottom']})}`}>
                  {event.cost
                    ? event.cost
                    : 'Free admission'
                  }
                </span>
                <div className='flex flex--v-center'>
                  <Icon name='ticket' />
                  <span className={spacing({s: 1}, {margin: ['left']})}>
                    {getTicketedMarkup(event)}
                  </span>
                </div>
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
