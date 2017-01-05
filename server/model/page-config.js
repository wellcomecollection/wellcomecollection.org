import {Record} from 'immutable';
import {defaultPlacesOpeningHours} from './opening-hours';

export const PageConfig = Record({
  inSection: null,
  openingHours: defaultPlacesOpeningHours
});
