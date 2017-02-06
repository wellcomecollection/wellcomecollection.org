// @flow
import {type PlacesOpeningHours, defaultPlacesOpeningHours} from './opening-hours';

// TODO: Make this a strict object, but then we have problems with Object.assign...
export type PageConfig = {
  title: string;
  inSection?: string;
  openingHours: PlacesOpeningHours;
};

export function createPageConfig(data: PageConfig) {
  const withOpeningHours = Object.assign({}, {openingHours: defaultPlacesOpeningHours}, data);
  return (withOpeningHours: PageConfig);
}
