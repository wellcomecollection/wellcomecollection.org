import { Fragment, FunctionComponent } from 'react';
import styled from 'styled-components';

import { eventPolicyIds } from '@weco/common/data/hardcoded-ids';
import { font } from '@weco/common/utils/classnames';
import { isPast } from '@weco/common/utils/dates';
import { formatDayDate, formatTime } from '@weco/common/utils/format-date';
import { HTMLTime } from '@weco/common/views/components/HTMLDateAndTime';
import LabelsList from '@weco/common/views/components/LabelsList/LabelsList';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import { themeValues } from '@weco/common/views/themes/config';
import EventbriteButtons from '@weco/content/components/EventbriteButtons/EventbriteButtons';
import Message from '@weco/content/components/Message/Message';
import { isEventPast } from '@weco/content/services/prismic/events';
import { Event } from '@weco/content/types/events';
import { Place } from '@weco/content/types/places';

import EventBookingButton from './EventBookingButton';

type Props = {
  event: Event;
  isNotLinked: boolean;
};

const GridWithRowGap = styled(Grid)`
  row-gap: ${themeValues.spaceAtBreakpoints.small.m}px;

  ${props =>
    props.theme.media('medium')(`
    row-gap: ${themeValues.spaceAtBreakpoints.medium.m}px;
  `)}

  ${props =>
    props.theme.media('large')(`
    row-gap: ${themeValues.spaceAtBreakpoints.large.m}px;
  `)}
`;

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

// We have a message block on scheduled events which either displays
// 'Just turn up' or 'Arrive early to register'
// N.B. If the criteria to display both messages is satisfied, we only show 'Arrive early to register' (see below)
// We don't show either message if the following criteria aren't satisfied:
function shouldShowMessage(event: Event): boolean {
  return (
    !isEventPast(event) &&
    !event.eventbriteId &&
    !event.bookingEnquiryTeam &&
    !(event.schedule && event.schedule.length > 1)
  );
}
// We should show the 'Arrive early to register' message if:
// - event.hasEarlyRegistration is true AND
// - the event isn't past AND
// - it doesn't require booking (either through Eventbrite or by contacting the booking enquiry team) AND
// - it doesn't have it's own event schedule
function shouldShowEarlyRegistrationMessage(event: Event): boolean {
  return event.hasEarlyRegistration;
}

// We should show the 'Just turn up' message if 'drop in at any time' policy is added to the event AND
function shouldShowJustTurnUpMessage(event: Event): boolean {
  const hasDropInPolicy = event.policies.some(
    p => p.id === eventPolicyIds.dropIn
  );
  return hasDropInPolicy;
}

const HintText: FunctionComponent<{ event: Event }> = ({ event }) => {
  const showMessage = shouldShowMessage(event);
  const hasEarlyRegistration = shouldShowEarlyRegistrationMessage(event);
  const hasDropInPolicy = shouldShowJustTurnUpMessage(event);
  if (showMessage && (hasEarlyRegistration || hasDropInPolicy)) {
    return (
      <Space $v={{ size: 'm', properties: ['margin-top'] }}>
        <Message
          text={`${
            hasEarlyRegistration ? 'Arrive early to register' : 'Just turn up'
          }`}
        />
      </Space>
    );
  } else {
    return null;
  }
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
      <GridWithRowGap>
        <GridCell
          $sizeMap={{
            s: [12],
            m: [12],
            l: [3],
            xl: [2],
          }}
        >
          {event.times.map(t => {
            const startTimeString = t.range.startDateTime.toISOString();
            return (
              <h4
                style={{ marginBottom: 0 }}
                key={`${event.title} ${startTimeString}`}
                className={font('intb', 5)}
              >
                <HTMLTime date={t.range.startDateTime} />
                {' – '}
                <HTMLTime date={t.range.endDateTime} />
              </h4>
            );
          })}
        </GridCell>

        <GridCell
          $sizeMap={{
            s: [12],
            m: [12],
            l: [9],
            xl: [10],
          }}
        >
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

            <HintText event={event} />

            {event.secondaryLabels.length > 0 && (
              <Space $v={{ size: 'm', properties: ['margin-top'] }}>
                <LabelsList
                  labels={event.secondaryLabels}
                  defaultLabelColor="black"
                />
              </Space>
            )}
          </div>
        </GridCell>
      </GridWithRowGap>
    </GridWrapper>
  );
};

export default EventScheduleItem;
