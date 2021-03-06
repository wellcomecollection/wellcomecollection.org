// @flow
import Router from 'next/router';
import {
  CatalogueWorksApiProps,
  CatalogueImagesApiProps,
} from '../../../services/catalogue/ts_api';

type ServiceName = 'search_relevance_implicit';

type SearchResultSelectedData = {
  source: string;
  id: string;
  position: number;
  resultWorkType: string;
  resultIdentifiers?: string[];
  resultSubjects?: string[];
};

const trackSearchResultSelected = (
  params: CatalogueWorksApiProps | CatalogueImagesApiProps,
  data: SearchResultSelectedData
): void => {
  track(params, 'Search result selected', 'search_relevance_implicit', data);
};

type SearchData = { source: string; totalResults: number };
const trackSearch = (
  params: CatalogueWorksApiProps | CatalogueImagesApiProps,
  data: SearchData
): void => {
  const query = params.query;
  if (query && query !== '') {
    track(params, 'Search', 'search_relevance_implicit', data);
  } else {
    track(params, 'Search landing', 'search_relevance_implicit', data);
  }
};

type SearchImageExpandedData = {
  source: string;
  id: string;
};
const trackSearchImageExpanded = (
  params: CatalogueWorksApiProps | CatalogueImagesApiProps,
  data: SearchImageExpandedData
): void => {
  track(params, 'Search image expanded', 'search_relevance_implicit', data);
};

type TrackingEventData =
  | SearchResultSelectedData
  | SearchData
  | SearchImageExpandedData;

function track(
  params: CatalogueWorksApiProps | CatalogueImagesApiProps,
  eventName: string,
  serviceName: ServiceName,
  data?: TrackingEventData
) {
  // returns `["withNotes:true", "testb:false"]`
  let debug = false;
  const toggles = document.cookie
    .split(';')
    .map(cookie => {
      const parts = cookie.split('=');
      const key = parts[0] && parts[0].trim();
      const value = parts[1] && parts[1].trim();

      if (key === 'search_analytics_debug' && value === 'true') {
        debug = false;
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
}

export { trackSearch, trackSearchResultSelected, trackSearchImageExpanded };
