import type {Article} from './article';
import type {PlacesOpeningHours} from './opening-hours';
import type {Organization} from './organization';
import {defaultPlacesOpeningHours} from './opening-hours';
import {wellcomeCollection} from './organization';

// TODO: Make this a strict object, but then we have problems with Object.assign...
export type PageConfig = {
  path: string;
  title: string;
  inSection?: string;
  openingHours?: PlacesOpeningHours;
  organization?: Organization;
  category?: 'editorial' | 'list' | 'info' | 'item';
  series?: ?string;
  positionInSeries?: ?number;
  contentType?: ?string;
  canonicalUri?: ?string;
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
  'the-outsiders'
];

export function getEditorialAnalyticsInfo(article: Article) {
  const seriesTracking = article.series.map(series => {
    if (series.id) {
      return `${series.name}:${series.id}`;
    } else if (series.url && seriesUrls.indexOf(series.url) !== -1) {
      return `${series.name}:${series.url}`;
    }
  }).filter(_ => _).join(',');
  const seriesUrl = seriesTracking !== '' ? seriesTracking : null;
  const positionInSeries = article.positionInSeries;
  const contentType = article.contentType;

  return {seriesUrl, positionInSeries, contentType};
}
