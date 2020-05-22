// @flow
import Router from 'next/router';
import { type CatalogueWorksApiProps } from '../../../services/catalogue/api';

type RelevanceRatingData = {|
  position: number,
  id: string,
  rating: number,
  query: string,
  page: number,
  workType: ?(string[]),
|};

type ServiceName = 'search_relevance_implicit' | 'search_relevance_explicit';

const trackRelevanceRating = (
  params: CatalogueWorksApiProps,
  data: RelevanceRatingData
) => {
  track(params, 'Relevance rating', 'search_relevance_explicit', data);
};

type SearchResultSelectedData = {|
  source: string,
  id: string,
  position: number,
  resultWorkType: string,
  resultLanguage: ?string,
  resultIdentifiers: ?string,
  resultSubjects: ?string,
|};
const trackSearchResultSelected = (
  params: CatalogueWorksApiProps,
  data: SearchResultSelectedData
) => {
  track(params, 'Search result selected', 'search_relevance_implicit', data);
};

type SearchData = {| source: string, totalResults: number |};
const trackSearch = (params: CatalogueWorksApiProps, data: SearchData) => {
  const query = params.query;
  if (query && query !== '') {
    track(params, 'Search', 'search_relevance_implicit', data);
  } else {
    track(params, 'Search landing', 'search_relevance_implicit', data);
  }
};

type SearchImageExpandedData = {|
  source: string,
  id: string,
|};
const trackSearchImageExpanded = (
  params: CatalogueWorksApiProps,
  data: SearchImageExpandedData
) => {
  track(params, 'Search image expanded', 'search_relevance_implicit', data);
};

type TrackingEventData =
  | SearchResultSelectedData
  | RelevanceRatingData
  | SearchData
  | SearchImageExpandedData;

const track = (
  params: CatalogueWorksApiProps,
  eventName: string,
  serviceName: ServiceName,
  data: ?TrackingEventData
) => {
  // returns `["withNotes:true", "testb:false"]`
  let debug = false;
  const toggles = document.cookie
    .split(';')
    .map(cookie => {
      const parts = cookie.split('=');
      const key = parts[0] && parts[0].trim();
      const value = parts[1] && parts[1].trim();

      if (key === 'analytics_debug' && value === 'true') {
        debug = true;
      }

      if (key && key.match('toggle_')) {
        return `${key.replace('toggle_', '')}:${value}`;
      }
    })
    .filter(Boolean);

  const event = {
    service: serviceName,
    path: Router.pathname,
    eventName,
    query: params,
    toggles,
    data,
  };

  if (debug) {
    console.info(event);
  }

  window.analytics && window.analytics.track(eventName, event);
};

export {
  trackRelevanceRating,
  trackSearch,
  trackSearchResultSelected,
  trackSearchImageExpanded,
};
