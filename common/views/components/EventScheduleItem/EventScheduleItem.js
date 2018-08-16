// @flow
import {Fragment} from 'react';
import {grid, font, spacing} from '../../../utils/classnames';
import Icon from '../Icon/Icon';
import PrimaryLink from '../Links/PrimaryLink/PrimaryLink';
import LabelsList from '../LabelsList/LabelsList';
import EventBookingButton from '../EventBookingButton/EventBookingButton';
import camelize from '../../../utils/camelize';
import {formatTime, london} from '../../../utils/format-date';
import type {UiEvent} from '../../../model/events';

type Props = {|
  event: UiEvent,
  hasOwnPage: boolean
|}

function getTicketedMarkup(event) {
  if (event.eventbriteId) {
    return 'Ticketed';
  } else if (event.bookingEnquiryTeam) {
    return 'Enquire to book';
  } else {
    return 'No ticket required';
  }
}
const EventScheduleItem = ({event, hasOwnPage}: Props) => {
  const lastTime = event.times[event.times.length - 1];
  const isPast = lastTime && london(lastTime.range.endDateTime).isBefore(london());
  return (
    <li className={`event-schedule__item ${spacing({l: 0}, {padding: ['left']})} ${spacing({s: 4, l: 6}, {padding: ['bottom']})} ${spacing({s: 4}, {margin: ['bottom']})} border-color-smoke border-bottom-width-2`}>
      <div className='grid'>
        <div className={`${grid({s: 12, m: 12, l: 2, xl: 2})} ${spacing({s: 2, l: 0}, {margin: ['bottom']})}`}>
          {event.times && event.times.map((t) => {
            const startTimeString = t.range.startDateTime.toString();
            const endTimeString = t.range.endDateTime.toString();
            return (
              <p key={`${event.title} ${startTimeString}`} className={`${font({s: 'HNM4'})} no-margin`}>
                <time dateTime={startTimeString}>{formatTime(t.range.startDateTime)}</time>&mdash;<time dateTime={endTimeString}>{formatTime(t.range.endDateTime)}</time>
              </p>
            );
          })}
          {event.place &&
            <p className={`no-margin ${font({s: 'HNL4'})}`}>{event.place.title}</p>
          }
        </div>
        <div className={`${grid({s: 12, m: 12, l: 7, xl: 7})}`}>
          <div className={spacing({s: 2}, {margin: ['bottom']})}>
            {event.format && <LabelsList labels={[{
              text: event.format.title,
              url: null
            }]} />}
          </div>
          <div className={`event-schedule__main ${spacing({l: 2}, {padding: ['right']})}`}>
            <h3 className={`${font({s: 'WB6', l: 'WB5'})} ${spacing({s: 0}, {margin: ['top']})} ${spacing({s: 1}, {margin: ['bottom']})}`}>{event.title}</h3>

            <p className={`${spacing({s: 2}, {margin: ['bottom']})} ${font({s: 'HNL5', m: 'HNL4'})}`} dangerouslySetInnerHTML={{__html: event.description}} />

            {hasOwnPage &&
              <PrimaryLink url={`/events/${event.id}`} name='Full event details' screenReaderText={`about ${event.title}`} />
            }

            {!isPast && (event.eventbriteId || event.bookingEnquiryTeam) &&
              <div className={spacing({s: 2}, {margin: ['top']})}>
                <EventBookingButton event={event} />
              </div>
            }
          </div>
        </div>
        <div className={`${grid({s: 12, m: 12, l: 3, xl: 3})} ${spacing({s: 2, l: 0}, {margin: ['top']})}`}>
          <div className='event-schedule__meta'>
            {!isPast &&
              <div className='event-schedule__tickets'>
                <div className={`${font({s: 'HNM5', m: 'HNM4'})}`}>
                  {event.cost &&
                    <span className={`block ${spacing({s: 2}, {margin: ['bottom']})}`}>
                      {event.cost}
                    </span>
                  }
                  <div className={`flex flex--v-center ${spacing({s: 2}, {margin: ['bottom']})}`}>
                    <Icon name='ticket' />
                    <span className={spacing({s: 1}, {margin: ['left']})}>
                      {getTicketedMarkup(event)}
                    </span>
                  </div>
                </div>
              </div>
            }
            {event.interpretations && event.interpretations.length > 0 &&
              <Fragment>
                <h4 className='visually-hidden'>Accessibility interpretations</h4>
                <ul className={`plain-list no-padding ${font({s: 'HNM5', m: 'HNM4'})}`}>
                  {event.interpretations.map(interpretation => (
                    <li key={interpretation.interpretationType.title} className={`flex flex--v-center ${spacing({s: 2}, {margin: ['bottom']})}`}>
                      <Icon title={interpretation.interpretationType.title} name={camelize(interpretation.interpretationType.title)} />
                      <span className={spacing({s: 1}, {margin: ['left']})}>
                        {interpretation.interpretationType.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </Fragment>
            }
          </div>
        </div>
      </div>
    </li>
  );
};

export default EventScheduleItem;
