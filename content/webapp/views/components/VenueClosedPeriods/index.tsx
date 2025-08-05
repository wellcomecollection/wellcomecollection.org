import { FunctionComponent } from 'react';

import {
  collectionVenueId,
  getNameFromCollectionVenue,
} from '@weco/common/data/hardcoded-ids';
import { Venue } from '@weco/common/model/opening-hours';
import { groupConsecutiveExceptionalDays } from '@weco/common/services/prismic/opening-times';
import { HTMLDayDate } from '@weco/common/views/components/HTMLDateAndTime';

type Props = {
  venue: Venue;
};

const VenueClosedPeriods: FunctionComponent<Props> = ({ venue }) => {
  const onlyClosedDays = venue.openingHours.exceptional.filter(
    day => day.isClosed
  );
  const groupedConsectiveClosedDays =
    groupConsecutiveExceptionalDays(onlyClosedDays);

  return groupedConsectiveClosedDays[0] &&
    groupedConsectiveClosedDays[0].length > 0 ? (
    <div data-component="venue-closed-periods" className="body-text">
      <h2>{getNameFromCollectionVenue(venue.id)} closures</h2>
      {venue.id === collectionVenueId.libraries.id && (
        <p style={{ marginBottom: 0 }}>
          Planning a research visit? Our library is closed over bank holiday
          weekends and between Christmas Eve and New Year{`'`}s Day:
        </p>
      )}

      <ul>
        {groupedConsectiveClosedDays.map((closedGroup, i) => {
          const firstDate = closedGroup[0].overrideDate;
          const lastDate =
            closedGroup.length > 1
              ? closedGroup[closedGroup.length - 1].overrideDate
              : undefined;
          return (
            closedGroup.length > 0 && (
              <li key={i}>
                <HTMLDayDate date={firstDate} />
                {lastDate && (
                  <>
                    &ndash;
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
