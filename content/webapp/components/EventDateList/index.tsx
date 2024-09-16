import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { isPast } from '@weco/common/utils/dates';
import Space from '@weco/common/views/components/styled/Space';
import DateRange from '@weco/content/components/DateRange/DateRange';
import EventStatus from '@weco/content/components/EventStatus';
import { HasTimes } from '@weco/content/types/events';

const TimeWrapper = styled(Space).attrs({
  $v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
})`
  display: flex;
  justify-content: space-between;
  border-top: 1px solid ${props => props.theme.color('warmNeutral.400')};
`;

const DateRangeWrapper = styled.div<{ $isPast: boolean }>`
  ${props => props.$isPast && `color: ${props.theme.color('neutral.600')};`};
  flex: 1;
`;

const EventDateList: FunctionComponent<{ event: HasTimes }> = ({ event }) => {
  return (
    <>
      {event.times.map((eventTime, index) => {
        return (
          <TimeWrapper key={index}>
            <DateRangeWrapper $isPast={isPast(eventTime.range.endDateTime)}>
              <DateRange
                start={eventTime.range.startDateTime}
                end={eventTime.range.endDateTime}
              />
            </DateRangeWrapper>

            {isPast(eventTime.range.endDateTime) ? (
              <EventStatus text="Past" color="neutral.500" />
            ) : eventTime.isFullyBooked.inVenue &&
              eventTime.isFullyBooked.online ? (
              <EventStatus text="Full" color="validation.red" />
            ) : null}
          </TimeWrapper>
        );
      })}
    </>
  );
};

export default EventDateList;
