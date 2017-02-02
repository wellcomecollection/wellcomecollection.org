// @flow
import {type PlacesOpeningHours, defaultPlacesOpeningHours} from './opening-hours';

export type PageConfig = {
  title: string;
  inSection?: string;
  openingHours: PlacesOpeningHours;
};

export function pageConfig(data: PageConfig) {
  const withOpeningHours = Object.assign({}, data, {openingHours: defaultPlacesOpeningHours});
  return (withOpeningHours: PageConfig);
}
