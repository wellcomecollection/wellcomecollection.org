import { FunctionComponent } from 'react';
import { Venue } from '@weco/common/model/opening-hours';
import {
  backfillExceptionalVenueDays,
  getExceptionalOpeningPeriods,
  getExceptionalClosedDays,
  groupConsecutiveDays,
  convertJsonDateStringsToMoment,
  parseOpeningTimes,
} from '../../../services/prismic/opening-times';
import { formatDayDate } from '@weco/common/utils/format-date';
import {
  collectionVenueId,
  getNameFromCollectionVenue,
} from '@weco/common/services/prismic/hardcoded-id';
import { usePrismicData } from '../../../server-data/Context';
type Props = {
  venue: Venue;
};

const VenueClosedPeriods: FunctionComponent<Props> = ({ venue }) => {
  const prismicData = usePrismicData();
  const openingTimes = parseOpeningTimes(prismicData.collectionVenues);
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
    : [[]];
  return groupedConsectiveClosedDays[0] &&
    groupedConsectiveClosedDays[0].length > 0 ? (
    <div className="body-text">
      <h2>{getNameFromCollectionVenue(venue.id)} closures</h2>
      {venue.id === collectionVenueId.libraries.id && (
        <p className="no-margin">
          Planning a research visit? Our library is closed over bank holiday
          weekends and between Christmas Eve and New Year{`'`}s Day:
        </p>
      )}

      <ul>
        {/* TODO date range component */}
        {groupedConsectiveClosedDays.map((closedGroup, i) => {
          const firstDate =
            closedGroup[0].overrideDate &&
            formatDayDate(closedGroup[0].overrideDate?.toDate());
          const lastDate =
            closedGroup.length > 1 &&
            closedGroup[closedGroup.length - 1].overrideDate
              ? formatDayDate(
                  closedGroup[closedGroup.length - 1].overrideDate!.toDate()
                )
              : undefined;
          return (
            closedGroup.length > 0 && (
              <li key={i}>
                {firstDate}
                {lastDate && (
                  <>
                    &mdash;
                    {lastDate}
                  </>
                )}
              </li>
            )
          );
        })}
      </ul>
    </div>
  ) : null;
};

export default VenueClosedPeriods;
