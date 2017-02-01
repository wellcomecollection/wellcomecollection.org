import {Record} from 'immutable';
import {defaultPlacesOpeningHours} from './opening-hours';

export const PageConfig = Record({
  title: null,
  inSection: null,
  openingHours: defaultPlacesOpeningHours
});
