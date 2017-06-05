// @flow
import type {Article} from './article';
import getCommissionedSeries from '../filters/get-commissioned-series';
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
  gaContentType?: string;
};

export function createPageConfig(data: PageConfig) {
  const defaults = {
    openingHours: defaultPlacesOpeningHours,
    organization: wellcomeCollection
  };
  const withOpeningHours = Object.assign({}, defaults, data);
  return (withOpeningHours: PageConfig);
}

export function getGaContentType(article: Article) {
  const digitalStory = getCommissionedSeries(article.series);

  return digitalStory ? `editorial:chapter:${digitalStory.url}` : `editorial:${article.contentType}`;
}
