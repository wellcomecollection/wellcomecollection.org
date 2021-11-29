import { createContext } from 'react';
import { CollectionOpeningTimes } from '../../../model/opening-hours';

export const defaultValue: OpeningTimes = {
  collectionOpeningTimes: {
    placesOpeningHours: [],
    upcomingExceptionalOpeningPeriods: [],
  },
  placesOpeningHours: [],
  upcomingExceptionalOpeningPeriods: [],
};

// This appears to be nested in various confusing ways hence the inheritance
export interface OpeningTimes extends CollectionOpeningTimes {
  collectionOpeningTimes: CollectionOpeningTimes;
}
const OpeningTimesContext = createContext<OpeningTimes>(defaultValue);
export default OpeningTimesContext;
