// @flow
import { useEffect } from 'react';
import Router from 'next/router';

type RelevanceRatingData = {|
  position: number,
  id: string,
  rating: number,
  query: string,
  page: number,
  workType: ?(string[]),
  _queryType: ?string,
|};

type ServiceName = 'search_relevance_implicit' | 'search_relevance_explicit';

const trackRelevanceRating = (data: RelevanceRatingData) => {
  track('Relevance rating', 'search_relevance_explicit', data);
};

type SearchResultSelectedData = {|
  id: string,
  position: number,
  resultWorkType: string,
  resultLanguage: ?string,
  resultIdentifiers: ?string,
  resultSubjects: ?string,
|};
const trackSearchResultSelected = (data: SearchResultSelectedData) => {
  track('Search result selected', 'search_relevance_implicit', data);
};

const trackSearch = () => {
  track('Search', 'search_relevance_implicit');
};

const trackSearchLanding = () => {
  track('Search landing', 'search_relevance_implicit');
};

type TrackingEventData = SearchResultSelectedData | RelevanceRatingData;
const track = (
  eventName: string,
  serviceName: ServiceName,
  data: ?TrackingEventData
) => {
  const query = {
    ...Router.query,
  };
  // These are from the global contex, we should probably not be storing them on the query
  delete query.toggles;
  delete query.globalAlert;
  delete query.openingTimes;

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
    query,
    toggles,
    data,
  };

  if (debug) {
    console.info(event);
  }

  window.analytics && window.analytics.track(eventName, event);
};

const TrackerScript = () => {
  useEffect(() => {
    const analytics = (window.analytics = window.analytics || []);
    if (!analytics.initialize)
      if (analytics.invoked)
        window.console &&
          console.error &&
          console.error('Segment snippet included twice.');
      else {
        analytics.invoked = !0;
        analytics.methods = [
          'trackSubmit',
          'trackClick',
          'trackLink',
          'trackForm',
          'pageview',
          'identify',
          'reset',
          'group',
          'track',
          'ready',
          'alias',
          'debug',
          'page',
          'once',
          'off',
          'on',
        ];
        analytics.factory = function(t) {
          return function() {
            var e = Array.prototype.slice.call(arguments);
            e.unshift(t);
            analytics.push(e);
            return analytics;
          };
        };
        for (var t = 0; t < analytics.methods.length; t++) {
          var e = analytics.methods[t];
          analytics[e] = analytics.factory(e);
        }
        analytics.load = function(t, e) {
          var n = document.createElement('script');
          n.type = 'text/javascript';
          n.async = !0;
          n.src =
            'https://cdn.segment.com/analytics.js/v1/' +
            t +
            '/analytics.min.js';
          var a = document.getElementsByTagName('script')[0];
          a.parentNode && a.parentNode.insertBefore(n, a);
          analytics._loadOptions = e;
        };
        analytics.SNIPPET_VERSION = '4.1.0';
        analytics.load('78Czn5jNSaMSVrBq2J9K4yJjWxh6fyRI');
      }
  }, []);

  return null;
};

export {
  trackRelevanceRating,
  trackSearch,
  trackSearchResultSelected,
  trackSearchLanding,
  TrackerScript,
};
