import { useContext } from 'react';
import {
  backfillExceptionalVenueDays,
  getExceptionalOpeningPeriods,
  getExceptionalClosedDays,
  groupConsecutiveDays,
} from '../../../services/prismic/opening-times';
import { formatDayDate } from '@weco/common/utils/format-date';
import OpeningTimesContext from '@weco/common/views/components/OpeningTimesContext/OpeningTimesContext';

type Props = {|
  venue: any, // FIXME: Flow
|};

const VenueClosedPeriods = ({ venue }: Props) => {
  const openingTimes = useContext(OpeningTimesContext);
  const exceptionalPeriods = getExceptionalOpeningPeriods(openingTimes);
  const backfilledExceptionalPeriods = backfillExceptionalVenueDays(
    venue,
    exceptionalPeriods
  );
  const onlyClosedDays =
    backfilledExceptionalPeriods &&
    getExceptionalClosedDays(backfilledExceptionalPeriods);
  const groupedConsectiveClosedDays = onlyClosedDays
    ? groupConsecutiveDays(onlyClosedDays)
    : [];

  return groupedConsectiveClosedDays[0].length > 0 ? (
    <div className="row">
      <div className="container">
        <div className="grid">
          <ul>
            {/* TODO date range component */}
            {groupedConsectiveClosedDays.map(
              (closedGroup, i) =>
                closedGroup.length > 0 && (
                  <li key={i}>
                    {formatDayDate(closedGroup[0].overrideDate.toDate())}
                    {closedGroup.length > 1 && (
                      <>
                        &mdash;
                        {formatDayDate(
                          closedGroup[
                            closedGroup.length - 1
                          ].overrideDate.toDate()
                        )}
                      </>
                    )}
                  </li>
                )
            )}
          </ul>
        </div>
      </div>
    </div>
  ) : null;
};

export default VenueClosedPeriods;
