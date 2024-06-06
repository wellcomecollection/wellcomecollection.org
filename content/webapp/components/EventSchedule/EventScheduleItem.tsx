import { Fragment, FunctionComponent } from 'react';
import { grid, font } from '@weco/common/utils/classnames';
import EventBookingButton from './EventBookingButton';
import EventbriteButtons from '../EventbriteButtons/EventbriteButtons';
import LabelsList from '@weco/common/views/components/LabelsList/LabelsList';
import Message from '@weco/content/components/Message/Message';
import { formatTime, formatDayDate } from '@weco/common/utils/format-date';
import { Event } from '@weco/content/types/events';
import Space from '@weco/common/views/components/styled/Space';
import styled from 'styled-components';
import { isEventPast } from '../../services/prismic/events';
import { isPast } from '@weco/common/utils/dates';
import { HTMLTime } from '@weco/common/views/components/HTMLDateAndTime';
import { Place } from '@weco/content/types/places';

type Props = {
  event: Event;
  isNotLinked: boolean;
};

const GridWrapper = styled(Space).attrs({
  $v: {
    size: 'l',
    properties: ['margin-bottom', 'padding-bottom'],
  },
})`
  border-bottom: 1px solid ${props => props.theme.color('neutral.300')};
`;

const EventContainer = styled(Space).attrs({
  $v: {
    size: 'm',
    properties: [
      'margin-top',
      'margin-bottom',
      'padding-top',
      'padding-bottom',
    ],
  },
  $h: {
    size: 'm',
    properties: ['padding-left', 'padding-right'],
  },
  className: font('intb', 5),
})`
  display: inline-block;
  background-color: ${props => props.theme.color('yellow')};
`;

const EventTimesWrapper = styled(Space).attrs({
  $v: {
    size: 'm',
    properties: ['margin-bottom'],
  },
  className: grid({ s: 12, m: 12, l: 3, xl: 2 }),
})`
  ${props => props.theme.media('large')`
    margin: 0;
  `}

  h4 {
    margin-bottom: 0;
  }
`;

const eventLocations = (locations: Place[], isHybridEvent: boolean) => {
  if (isHybridEvent) return null; // if it's a hybrid event the location is displayed with the buttons
  if (locations.length === 0) return null;

  return (
    <Space
      $v={{ size: 's', properties: ['margin-bottom'] }}
      className={font('intr', 5)}
      style={{ display: 'flex', alignItems: 'center' }}
    >
      {locations.map((l, i) => {
        return (
          <Fragment key={l.id}>
            <span>{l.title}</span>
            {i !== locations.length - 1 && (
              <Space
                aria-hidden="true"
                $h={{
                  size: 's',
                  properties: ['padding-left', 'padding-right'],
                }}
              >
                |
              </Space>
            )}
          </Fragment>
        );
      })}
    </Space>
  );
};

const EventScheduleItem: FunctionComponent<Props> = ({
  event,
  isNotLinked,
}) => {
  const waitForTicketSales =
    event.ticketSalesStart && !isPast(event.ticketSalesStart);
  const isHybridEvent = event.eventbriteId && event.onlineEventbriteId;

  return (
    <GridWrapper>
      <div className="grid">
        <EventTimesWrapper>
          {event.times.map(t => {
            const startTimeString = t.range.startDateTime.toISOString();
            return (
              <h4
                key={`${event.title} ${startTimeString}`}
                className={font('intb', 5)}
              >
                <HTMLTime date={t.range.startDateTime} />
                {' – '}
                <HTMLTime date={t.range.endDateTime} />
              </h4>
            );
          })}
        </EventTimesWrapper>
        <div className={grid({ s: 12, m: 12, l: 9, xl: 10 })}>
          <div>
            {event.primaryLabels.length > 0 && (
              <Space $v={{ size: 's', properties: ['margin-bottom'] }}>
                <LabelsList labels={event.primaryLabels} />
              </Space>
            )}
            <Space
              $v={{ size: 's', properties: ['margin-bottom'] }}
              as="h5"
              className={font('wb', 3)}
            >
              {event.title}
            </Space>

            {eventLocations(event.locations, Boolean(isHybridEvent))}

            {event.promo?.caption && (
              <Space
                $v={{ size: 'm', properties: ['margin-bottom'] }}
                className={font('intr', 5)}
                dangerouslySetInnerHTML={{ __html: event.promo?.caption }}
              />
            )}

            {!isNotLinked && (
              <Space
                $v={{
                  size: 'm',
                  properties: ['margin-top', 'margin-bottom'],
                }}
              >
                <p className={font('intr', 5)} style={{ marginBottom: 0 }}>
                  <a href={`/events/${event.id}`}>
                    Full event details
                    <span className="visually-hidden">
                      {' '}
                      about {event.title}
                    </span>
                  </a>
                </p>
              </Space>
            )}

            {!isEventPast(event) &&
              event.ticketSalesStart &&
              waitForTicketSales && (
                <EventContainer>
                  <span>
                    Booking opens {formatDayDate(event.ticketSalesStart)}{' '}
                    {formatTime(event.ticketSalesStart)}
                  </span>
                </EventContainer>
              )}

            {!isEventPast(event) &&
              (event.eventbriteId || event.onlineEventbriteId) &&
              !waitForTicketSales && (
                <Space $v={{ size: 'm', properties: ['margin-bottom'] }}>
                  <EventbriteButtons event={event} />
                </Space>
              )}

            {!isEventPast(event) &&
              event.bookingEnquiryTeam &&
              !waitForTicketSales && (
                <Space $v={{ size: 'm', properties: ['margin-top'] }}>
                  <EventBookingButton event={event} />
                </Space>
              )}

            {!isEventPast(event) &&
              !event.eventbriteId &&
              !event.bookingEnquiryTeam &&
              !(event.schedule && event.schedule.length > 1) && (
                <Space $v={{ size: 'm', properties: ['margin-top'] }}>
                  <Message
                    text={`${
                      event.hasEarlyRegistration
                        ? 'Arrive early to register'
                        : 'Just turn up'
                    }`}
                  />
                </Space>
              )}

            {event.secondaryLabels.length > 0 && (
              <Space $v={{ size: 'm', properties: ['margin-top'] }}>
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
