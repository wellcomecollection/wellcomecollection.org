// @flow
import {Fragment} from 'react';
import {grid, font, spacing} from '../../../utils/classnames';
import EventBookingButton from '../EventBookingButton/EventBookingButton';
import EventbriteButton from '../EventbriteButton/EventbriteButton';
import LabelsList from '../LabelsList/LabelsList';
import Message from '../Message/Message';
import {formatTime, formatDayDate, isTimePast, isDatePast} from '../../../utils/format-date';
import type {UiEvent} from '../../../model/events';

type Props = {|
  event: UiEvent,
  isNotLinked: boolean
|}

const EventScheduleItem = ({
  event,
  isNotLinked
}: Props) => {
  const waitForTicketSales = event.ticketSalesStart && !isTimePast(event.ticketSalesStart);
  return (
    <li className={`${spacing({l: 0}, {padding: ['left']})} ${spacing({s: 4, l: 6}, {padding: ['bottom']})} ${spacing({s: 4}, {margin: ['bottom']})} border-color-smoke border-bottom-width-1`}>
      <div className='grid'>
        <div className={`${grid({s: 12, m: 12, l: 3, xl: 2})} ${spacing({s: 2, l: 0}, {margin: ['bottom']})}`}>
          {event.times && event.times.map((t) => {
            const startTimeString = t.range.startDateTime.toString();
            const endTimeString = t.range.endDateTime.toString();
            return (
              <p key={`${event.title} ${startTimeString}`} className={`${font({s: 'HNM4'})} no-margin`}>
                <time dateTime={startTimeString}>{formatTime(t.range.startDateTime)}</time>&mdash;<time dateTime={endTimeString}>{formatTime(t.range.endDateTime)}</time>
              </p>
            );
          })}
        </div>
        <div className={`${grid({s: 12, m: 12, l: 9, xl: 10})}`}>
          <div>
            {event.labels.length > 0 &&
              <div className={spacing({s: 1}, {margin: ['bottom']})}>
                <LabelsList labels={event.labels} />
              </div>
            }
            <h3 className={`${font({s: 'WB6', l: 'WB5'})} ${spacing({s: 0}, {margin: ['top']})} ${spacing({s: 1}, {margin: ['bottom']})}`}>{event.title}</h3>
            {event.place &&
              <p className={`${spacing({s: 1}, {margin: ['bottom']})} ${font({s: 'HNL4'})}`}>{event.place.title}</p>
            }

            <p className={`${spacing({s: 2}, {margin: ['bottom']})} ${font({s: 'HNL5', m: 'HNL4'})}`} dangerouslySetInnerHTML={{__html: event.promoText}} />

            {event.ticketSalesStart && waitForTicketSales &&
              <Fragment>
                <div className={`bg-yellow inline-block ${spacing({s: 4}, {padding: ['left', 'right'], margin: ['top', 'bottom']})} ${spacing({s: 2}, {padding: ['top', 'bottom']})} ${font({s: 'HNM4'})}`}>
                  {/* TODO: work out why the second method below will fail Flow without a null check */}
                  <span>Booking opens {formatDayDate(event.ticketSalesStart)} {event.ticketSalesStart && formatTime(event.ticketSalesStart)}</span>
                </div>
              </Fragment>
            }

            {!isNotLinked &&
              <div className={spacing({s: 2}, {margin: ['top']})}>
                <p className={`plain-text ${font({s: 'HNL5', m: 'HNL4'})} no-margin`}>
                  <a href={`/events/${event.id}`}>Full event details<span className={`visually-hidden`}> about {event.title}</span></a>
                </p>
              </div>
            }

            {!isDatePast(event.dateRange.lastDate) && event.eventbriteId && !waitForTicketSales &&
              <EventbriteButton event={event} />
            }

            {!isDatePast(event.dateRange.lastDate) && event.bookingEnquiryTeam && !waitForTicketSales &&
              <div className={spacing({s: 2}, {margin: ['top']})}>
                <EventBookingButton event={event} />
              </div>
            }

            {!event.eventbriteId && !event.bookingEnquiryTeam && !(event.schedule && event.schedule.length > 1) &&
              <div className={spacing({s: 2}, {margin: ['top']})}>
                <Message text='Just turn up' />
              </div>
            }
          </div>
        </div>
      </div>
    </li>
  );
};

export default EventScheduleItem;
