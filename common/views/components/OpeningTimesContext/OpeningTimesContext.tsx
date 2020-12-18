import { createContext } from 'react';
import { CollectionOpeningTimes } from '../../../model/opening-hours';
// This appears to be nested in various confusing ways hence the inheritance
export interface OpeningTimes extends CollectionOpeningTimes {
  collectionOpeningTimes: CollectionOpeningTimes;
}
const OpeningTimesContext = createContext<OpeningTimes | null>(null);
export default OpeningTimesContext;
