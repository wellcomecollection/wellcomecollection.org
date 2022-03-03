import { Fragment } from 'react';
import { grid, font, classNames } from '@weco/common/utils/classnames';
import EventBookingButton from './EventBookingButton';
import EventbriteButton from '../EventbriteButton/EventbriteButton';
import LabelsList from '@weco/common/views/components/LabelsList/LabelsList';
import Message from '@weco/common/views/components/Message/Message';
import {
  formatTime,
  formatDayDate,
  isTimePast,
} from '@weco/common/utils/format-date';
import { Event } from '../../types/events';
import Space from '@weco/common/views/components/styled/Space';
import styled from 'styled-components';
import { isEventPast } from 'services/prismic/events';

type Props = {
  event: Event;
  isNotLinked: boolean;
};

const GridWrapper = styled(Space).attrs({
  v: {
    size: 'l',
    properties: ['margin-bottom', 'padding-bottom'],
  },
})`
  border-bottom: 1px solid ${props => props.theme.color('smoke')};
`;

const EventScheduleItem = ({ event, isNotLinked }: Props) => {
  const waitForTicketSales =
    event.ticketSalesStart && !isTimePast(event.ticketSalesStart);
  return (
    <GridWrapper>
      <div className="grid">
        <Space
          v={{
            size: 'm',
            properties: ['margin-bottom'],
          }}
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
                <h4
                  key={`${event.title} ${startTimeString}`}
                  className={`${font('hnb', 5)} no-margin`}
                >
                  <time dateTime={startTimeString}>
                    {formatTime(t.range.startDateTime)}
                  </time>
                  &mdash;
                  <time dateTime={endTimeString}>
                    {formatTime(t.range.endDateTime)}
                  </time>
                </h4>
              );
            })}
        </Space>
        <div className={`${grid({ s: 12, m: 12, l: 9, xl: 10 })}`}>
          <div>
            {event.primaryLabels.length > 0 && (
              <Space v={{ size: 's', properties: ['margin-bottom'] }}>
                <LabelsList labels={event.primaryLabels} />
              </Space>
            )}
            <Space
              v={{ size: 's', properties: ['margin-bottom'] }}
              as="h5"
              className="h2"
            >
              {event.title}
            </Space>
            {event.locations[0] && (
              <Space
                v={{ size: 's', properties: ['margin-bottom'] }}
                as="p"
                className={classNames({
                  [font('hnr', 5)]: true,
                })}
              >
                {event.locations[0].title}
              </Space>
            )}

            {event.promoText && (
              <Space
                v={{ size: 'm', properties: ['margin-bottom'] }}
                className={font('hnr', 5)}
                dangerouslySetInnerHTML={{ __html: event.promoText }}
              />
            )}

            {!isNotLinked && (
              <Space
                v={{
                  size: 'm',
                  properties: ['margin-top', 'margin-bottom'],
                }}
              >
                <p className={`${font('hnr', 5)} no-margin`}>
                  <a href={`/events/${event.id}`}>
                    Full event details
                    <span className={`visually-hidden`}>
                      {' '}
                      about {event.title}
                    </span>
                  </a>
                </p>
              </Space>
            )}

            {event.ticketSalesStart && waitForTicketSales && (
              <Fragment>
                <Space
                  v={{
                    size: 'm',
                    properties: [
                      'margin-top',
                      'margin-bottom',
                      'padding-top',
                      'padding-bottom',
                    ],
                  }}
                  h={{
                    size: 'm',
                    properties: ['padding-left', 'padding-right'],
                  }}
                  className={classNames({
                    'bg-yellow inline-block': true,
                    [font('hnb', 5)]: true,
                  })}
                >
                  <span>
                    Booking opens {formatDayDate(event.ticketSalesStart)}{' '}{formatTime(event.ticketSalesStart)}
                  </span>
                </Space>
              </Fragment>
            )}

            {!isEventPast(event) &&
              event.eventbriteId &&
              !waitForTicketSales && (
                <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
                  <EventbriteButton event={event} />
                </Space>
              )}

            {!isEventPast(event) &&
              event.bookingEnquiryTeam &&
              !waitForTicketSales && (
                <Space v={{ size: 'm', properties: ['margin-top'] }}>
                  <EventBookingButton event={event} />
                </Space>
              )}

            {!event.eventbriteId &&
              !event.bookingEnquiryTeam &&
              !(event.schedule && event.schedule.length > 1) && (
                <Space v={{ size: 'm', properties: ['margin-top'] }}>
                  <Message text="Just turn up" />
                </Space>
              )}

            {event.secondaryLabels.length > 0 && (
              <Space v={{ size: 'm', properties: ['margin-top'] }}>
                <LabelsList
                  labels={event.secondaryLabels}
                  defaultLabelColor="black"
                />
              </Space>
            )}
          </div>
        </div>
      </div>
    </GridWrapper>
  );
};

export default EventScheduleItem;
