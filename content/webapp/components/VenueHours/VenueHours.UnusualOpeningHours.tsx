import { FunctionComponent } from 'react';

import {
  ExceptionalOpeningHoursDay,
  OpeningHoursDay,
} from '@weco/common/model/opening-hours';
import { formatDayMonth, formatDayName } from '@weco/common/utils/format-date';

import { DifferentToRegularTime, OverrideDay } from './VenueHours.styles';

type UnusualOpeningHoursProps = {
  regular: OpeningHoursDay;
  exceptional: ExceptionalOpeningHoursDay;
};

/** This components highlights when our unusual opening hours differ from
 * our regular hours.
 */
const UnusualOpeningHours: FunctionComponent<UnusualOpeningHoursProps> = ({
  regular,
  exceptional,
}) => {
  return (
    <>
      <OverrideDay>
        {formatDayName(exceptional.overrideDate)}{' '}
        {formatDayMonth(exceptional.overrideDate)}
      </OverrideDay>{' '}
      {/* Case 1: the venue is closed, and would have been on a regular day */}
      {exceptional.isClosed && regular.isClosed && 'Closed'}
      {/* Case 2: the venue is closed, and wouldn't be on a regular day */}
      {exceptional.isClosed && !regular.isClosed && (
        <DifferentToRegularTime>Closed</DifferentToRegularTime>
      )}
      {/* Case 3: the venue is open, but would normally be closed */}
      {!exceptional.isClosed && regular.isClosed && (
        <DifferentToRegularTime>
          {exceptional.opens} – {exceptional.closes}
        </DifferentToRegularTime>
      )}
      {/* Case 4: the venue is open */}
      {!exceptional.isClosed && !regular.isClosed && (
        <>
          {exceptional.opens !== regular.opens ? (
            <DifferentToRegularTime>{exceptional.opens}</DifferentToRegularTime>
          ) : (
            exceptional.opens
          )}
          {' – '}
          {exceptional.closes !== regular.closes ? (
            <DifferentToRegularTime>
              {exceptional.closes}
            </DifferentToRegularTime>
          ) : (
            exceptional.closes
          )}
        </>
      )}
    </>
  );
};

export default UnusualOpeningHours;
