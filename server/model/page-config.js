import type {Article} from './article';
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
  category?: 'editorial' | 'list' | 'info' | 'item';
  series?: ?string;
  positionInSeries?: ?number;
  featuredContent?: ?string;
};

export function createPageConfig(data: PageConfig) {
  const defaults = {
    openingHours: defaultPlacesOpeningHours,
    organization: wellcomeCollection
  };
  const withOpeningHours = Object.assign({}, defaults, data);
  return (withOpeningHours: PageConfig);
}

const seriesUrls = [
  'a-drop-in-the-ocean',
  'electric-sublime',
  'body-squabbles',
  'electric-age',
  'outsiders'
];

export function getEditorialAnalyticsInfo(article: Article) {
  const series = article.series.find(a => seriesUrls.indexOf(a.url) > -1);
  const seriesUrl = series ? series.url : null;
  const positionInSeries = article.positionInSeries;
  const featuredContent = article.contentType;

  return {seriesUrl, positionInSeries, featuredContent};
}
