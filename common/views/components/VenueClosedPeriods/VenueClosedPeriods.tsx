import { FunctionComponent } from 'react';
import {
  getExceptionalVenueDays,
  parseOpeningTimes,
  getVenueById,
  groupConsecutiveDays,
} from '../../../services/prismic/opening-times';
import { formatDayDate } from '@weco/common/utils/format-date';
import {
  collectionVenueId,
  getNameFromCollectionVenue,
} from '@weco/common/services/prismic/hardcoded-id';
import { usePrismicData } from '../../../server-data/Context';
type Props = {
  venueId: string;
};

const VenueClosedPeriods: FunctionComponent<Props> = ({ venueId }) => {
  const prismicData = usePrismicData();
  const openingTimes = parseOpeningTimes(prismicData.collectionVenues);
  const venue = getVenueById(openingTimes, venueId);
  const exceptionalVenueDays = venue ? getExceptionalVenueDays(venue) : [];
  const onlyClosedDays = exceptionalVenueDays.filter(day => day.isClosed);
  const groupedConsectiveClosedDays = groupConsecutiveDays(onlyClosedDays);

  return groupedConsectiveClosedDays[0] &&
    groupedConsectiveClosedDays[0].length > 0 ? (
    <div className="body-text">
      <h2>{getNameFromCollectionVenue(venueId)} closures</h2>
      {venueId === collectionVenueId.libraries.id && (
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
