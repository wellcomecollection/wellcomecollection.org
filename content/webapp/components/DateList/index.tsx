import { FunctionComponent } from 'react';
import styled from 'styled-components';

import DateRange from '@weco/common/views/components/DateRange/DateRange';
import { Event } from '@weco/content/types/events';
import EventStatus from '../EventStatus';
import Space from '@weco/common/views/components/styled/Space';

import { isDayPast } from '@weco/common/utils/dates';

const TimeWrapper = styled(Space).attrs({
  v: {
    size: 'm',
    properties: ['padding-top', 'padding-bottom'],
  },
})`
  display: flex;
  justify-content: space-between;
  border-top: 1px solid ${props => props.theme.color('warmNeutral.400')};
`;

const DateRangeWrapper = styled.div<{ isPast: boolean }>`
  ${props => props.isPast && `color: ${props.theme.color('neutral.600')};`};
  flex: 1;
`;

const DateList: FunctionComponent<{ event: Event }> = ({ event }) => {
  return (
    event.times && (
      <>
        {event.times.map((eventTime, index) => {
          return (
            <TimeWrapper key={index}>
              <DateRangeWrapper isPast={isDayPast(eventTime.range.endDateTime)}>
                <DateRange
                  start={eventTime.range.startDateTime}
                  end={eventTime.range.endDateTime}
                />
              </DateRangeWrapper>

              {isDayPast(eventTime.range.endDateTime) ? (
                <EventStatus text="Past" color="neutral.500" />
              ) : eventTime.isFullyBooked.inVenue &&
                eventTime.isFullyBooked.online ? (
                <EventStatus text="Full" color="validation.red" />
              ) : null}
            </TimeWrapper>
          );
        })}
      </>
    )
  );
};

export default DateList;
