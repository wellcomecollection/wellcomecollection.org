import type { Venue } from '@weco/common/views/model/opening-hours';
import { useContext } from 'react';
import {
  backfillExceptionalVenueDays,
  getExceptionalOpeningPeriods,
  getExceptionalClosedDays,
  groupConsecutiveDays,
  convertJsonDateStringsToMoment,
} from '../../../services/prismic/opening-times';
import { formatDayDate } from '@weco/common/utils/format-date';
import OpeningTimesContext from '@weco/common/views/components/OpeningTimesContext/OpeningTimesContext';

type Props = {|
  venue: Venue,
|};

const VenueClosedPeriods = ({ venue }: Props) => {
  const openingTimes = useContext(OpeningTimesContext);
  const exceptionalPeriods = getExceptionalOpeningPeriods(openingTimes);
  const backfilledExceptionalPeriods = backfillExceptionalVenueDays(
    convertJsonDateStringsToMoment(venue),
    exceptionalPeriods
  );
  const onlyClosedDays =
    backfilledExceptionalPeriods &&
    getExceptionalClosedDays(backfilledExceptionalPeriods);
  const groupedConsectiveClosedDays = onlyClosedDays
    ? groupConsecutiveDays(onlyClosedDays)
    : [];

  return groupedConsectiveClosedDays[0].length > 0 ? (
    <div className="body-text">
      <h2>{venue.name} closures</h2>
      {venue.name.toLowerCase() === 'library' && (
        <p className="no-margin">
          Planning a research visit? Our library is closed over bank holiday
          weekends and between Christmas Eve and New Year{`'`}s Day:
        </p>
      )}

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
                      closedGroup[closedGroup.length - 1].overrideDate.toDate()
                    )}
                  </>
                )}
              </li>
            )
        )}
      </ul>
    </div>
  ) : null;
};

export default VenueClosedPeriods;
