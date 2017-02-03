// @flow
import {type PlacesOpeningHours, defaultPlacesOpeningHours} from './opening-hours';

export type PageConfig = {
  title: string;
  inSection?: string;
  openingHours: PlacesOpeningHours;
};

export function createPageConfig(data: PageConfig) {
  const withOpeningHours = Object.assign({}, {openingHours: defaultPlacesOpeningHours}, data);
  return (withOpeningHours: PageConfig);
}
