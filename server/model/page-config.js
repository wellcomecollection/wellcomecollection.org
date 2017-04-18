// @flow
import type {PlacesOpeningHours} from './opening-hours';
import type {Organization} from './organization';
import {defaultPlacesOpeningHours} from './opening-hours';
import {wellcomeCollection} from './organization';

// TODO: Make this a strict object, but then we have problems with Object.assign...
export type PageConfig = {
  title: string;
  inSection?: string;
  openingHours?: PlacesOpeningHours;
  organization?: Organization;
};

export function createPageConfig(data: PageConfig) {
  const defaults = {
    openingHours: defaultPlacesOpeningHours,
    organization: wellcomeCollection
  };
  const withOpeningHours = Object.assign({}, defaults, data);
  return (withOpeningHours: PageConfig);
}
