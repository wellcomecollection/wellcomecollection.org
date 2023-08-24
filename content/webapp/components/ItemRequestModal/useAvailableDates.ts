import {
  determineNextAvailableDate,
  extendEndDate,
} from '@weco/content/utils/dates';
import { usePrismicData } from '@weco/common/server-data/Context';
import { collectionVenueId } from '@weco/common/data/hardcoded-ids';
import { transformCollectionVenues } from '@weco/common/services/prismic/transformers/collection-venues';
import { getVenueById } from '@weco/common/services/prismic/opening-times';
import { addDays, today } from '@weco/common/utils/dates';
import { DayOfWeek } from '@weco/common/utils/format-date';

type AvailableDates = {
  nextAvailable?: Date;
  lastAvailable?: Date;
  exceptionalClosedDates: Date[];
  regularClosedDays: DayOfWeek[];
};

export const useAvailableDates = (): AvailableDates => {
  // We get the regular and exceptional days on which the library is closed from Prismic data,
  // so we can make these unavailable in the calendar.
  const { collectionVenues } = usePrismicData();

  const venues = transformCollectionVenues(collectionVenues);
  const libraryVenue = getVenueById(venues, collectionVenueId.libraries.id);

  const regularClosedDays = (libraryVenue?.openingHours.regular || [])
    .filter(t => t.isClosed)
    .map(t => t.dayOfWeek);

  const exceptionalClosedDates = (libraryVenue?.openingHours.exceptional || [])
    .filter(t => t.isClosed)
    .map(day => day.overrideDate)
    .filter(Boolean);

  const closedDates = { regularClosedDays, exceptionalClosedDates };

  const nextAvailable = determineNextAvailableDate(today(), closedDates);

  // There should be a minimum of a 2 week window in which to select a date
  const minimumLastAvailable = nextAvailable && addDays(nextAvailable, 13);
  // If the library is closed on any days during the selection window
  // we extend the lastAvailableDate to take these into account
  const lastAvailable = extendEndDate({
    startDate: nextAvailable,
    endDate: minimumLastAvailable,
    exceptionalClosedDates,
    regularClosedDays,
  });

  return {
    nextAvailable,
    lastAvailable,
    exceptionalClosedDates,
    regularClosedDays,
  };
};
