import { FunctionComponent } from 'react';
import {
  getExceptionalVenueDays,
  groupConsecutiveDays,
} from '../../../services/prismic/opening-times';
import {
  collectionVenueId,
  getNameFromCollectionVenue,
} from '../../../services/prismic/hardcoded-id';
import { Venue } from '../../../model/opening-hours';
import HTMLDayDate from '../HTMLDayDate/HTMLDayDate';

type Props = {
  venue: Venue;
};

const VenueClosedPeriods: FunctionComponent<Props> = ({ venue }) => {
  const exceptionalVenueDays = venue ? getExceptionalVenueDays(venue) : [];
  const onlyClosedDays = exceptionalVenueDays.filter(day => day.isClosed);
  const groupedConsectiveClosedDays = groupConsecutiveDays(onlyClosedDays);

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
        {groupedConsectiveClosedDays.map((closedGroup, i) => {
          const firstDate = closedGroup[0].overrideDate?.toDate();
          const lastDate =
            closedGroup.length > 1
              ? closedGroup[closedGroup.length - 1].overrideDate?.toDate()
              : undefined;
          return (
            closedGroup.length > 0 && (
              <li key={i}>
                {firstDate && <HTMLDayDate date={firstDate} />}
                {lastDate && (
                  <>
                    &mdash;
                    <HTMLDayDate date={lastDate} />
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
