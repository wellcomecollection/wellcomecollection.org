// @flow
import { Fragment } from 'react';
import { grid, font, classNames } from '../../../utils/classnames';
import EventBookingButton from '../EventBookingButton/EventBookingButton';
import EventbriteButton from '../EventbriteButton/EventbriteButton';
import LabelsList from '../LabelsList/LabelsList';
import Message from '../Message/Message';
import {
  formatTime,
  formatDayDate,
  isTimePast,
  isDatePast,
} from '../../../utils/format-date';
import type { UiEvent } from '../../../model/events';
import VerticalSpace from '../styled/VerticalSpace';

type Props = {|
  event: UiEvent,
  isNotLinked: boolean,
|};

const EventScheduleItem = ({ event, isNotLinked }: Props) => {
  const waitForTicketSales =
    event.ticketSalesStart && !isTimePast(event.ticketSalesStart);
  return (
    <VerticalSpace
      size="l"
      properties={['margin-bottom', 'padding-bottom']}
      className={classNames({
        'border-color-smoke border-bottom-width-1': true,
      })}
    >
      <div className="grid">
        <VerticalSpace
          size="m"
          className={classNames({
            [grid({ s: 12, m: 12, l: 3, xl: 2 })]: true,
            'no-margin-l': true,
          })}
        >
          {event.times &&
            event.times.map(t => {
              const startTimeString = t.range.startDateTime.toString();
              const endTimeString = t.range.endDateTime.toString();
              return (
                <p
                  key={`${event.title} ${startTimeString}`}
                  className={`${font('hnm', 5)} no-margin`}
                >
                  <time dateTime={startTimeString}>
                    {formatTime(t.range.startDateTime)}
                  </time>
                  &mdash;
                  <time dateTime={endTimeString}>
                    {formatTime(t.range.endDateTime)}
                  </time>
                </p>
              );
            })}
        </VerticalSpace>
        <div className={`${grid({ s: 12, m: 12, l: 9, xl: 10 })}`}>
          <div>
            {event.labels.length > 0 && (
              <VerticalSpace size="s">
                <LabelsList labels={event.labels} />
              </VerticalSpace>
            )}
            <VerticalSpace size="s" as="h3" className="h2">
              {event.title}
            </VerticalSpace>
            {event.place && (
              <VerticalSpace
                size="s"
                as="p"
                className={classNames({
                  [font('hnl', 5)]: true,
                })}
              >
                {event.place.title}
              </VerticalSpace>
            )}

            <VerticalSpace
              size="m"
              className={font('hnl', 5)}
              dangerouslySetInnerHTML={{ __html: event.promoText }}
            />

            {!isNotLinked && (
              <VerticalSpace
                size="m"
                properties={['margin-top', 'margin-bottom']}
              >
                <p className={`${font('hnl', 5)} no-margin`}>
                  <a href={`/events/${event.id}`}>
                    Full event details
                    <span className={`visually-hidden`}>
                      {' '}
                      about {event.title}
                    </span>
                  </a>
                </p>
              </VerticalSpace>
            )}

            {event.ticketSalesStart && waitForTicketSales && (
              <Fragment>
                <VerticalSpace
                  size="m"
                  properties={[
                    'margin-top',
                    'margin-bottom',
                    'padding-top',
                    'padding-bottom',
                  ]}
                  className={classNames({
                    'bg-yellow inline-block': true,
                    'padding-left-12 padding-right-12': true,
                    [font('hnm', 5)]: true,
                  })}
                >
                  {/* TODO: work out why the second method below will fail Flow without a null check */}
                  <span>
                    Booking opens {formatDayDate(event.ticketSalesStart)}{' '}
                    {event.ticketSalesStart &&
                      formatTime(event.ticketSalesStart)}
                  </span>
                </VerticalSpace>
              </Fragment>
            )}

            {!isDatePast(event.dateRange.lastDate) &&
              event.eventbriteId &&
              !waitForTicketSales && (
                <VerticalSpace size="m">
                  <EventbriteButton event={event} />
                </VerticalSpace>
              )}

            {!isDatePast(event.dateRange.lastDate) &&
              event.bookingEnquiryTeam &&
              !waitForTicketSales && (
                <VerticalSpace size="m" properties={['margin-top']}>
                  <EventBookingButton event={event} />
                </VerticalSpace>
              )}

            {!event.eventbriteId &&
              !event.bookingEnquiryTeam &&
              !(event.schedule && event.schedule.length > 1) && (
                <VerticalSpace size="m" properties={['margin-top']}>
                  <Message text="Just turn up" />
                </VerticalSpace>
              )}
          </div>
        </div>
      </div>
    </VerticalSpace>
  );
};

export default EventScheduleItem;
