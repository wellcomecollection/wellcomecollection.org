// @flow

import { useEffect } from 'react';

// Search
export const SearchEventNames = {
  CatalogueViewWork: 'Select Result',
  CatalogueSearch: 'Search',
};

type SearchEventName = $Values<typeof SearchEventNames>;

type ResultListResource = {|
  query: string,
  page: number,
  workType: ?(string[]),
|};

type WorkResultResource = {|
  id: string,
  position: number,
  query: string,
  page: number,
  workType: ?(string[]),
|};

type SearchResource = ResultListResource | WorkResultResource;

type SearchEvent = {|
  event: SearchEventName,
  data: SearchResource,
|};

// Relevance Rating
export const RelevanceRatingEventNames = {
  RateResultRelevance: 'Rate Result Relevance',
};

type RelevanceRatingEventName = $Values<typeof RelevanceRatingEventNames>;

type RelevanceRatingResource = {|
  position: number,
  id: string,
  rating: number,
  query: string,
  page: number,
  workType: ?(string[]),
|};

type RelevanceRatingEvent = {|
  event: RelevanceRatingEventName,
  data: RelevanceRatingResource,
|};

type LoggerEvent =
  | {| service: 'search', ...SearchEvent |}
  | {| service: 'relevance_rating', ...RelevanceRatingEvent |};

const trackSearch = (event: SearchEvent) => {
  const servicedEvent = {
    service: 'search',
    ...event,
  };
  track(servicedEvent);
};

const trackRelevanceRating = (event: RelevanceRatingEvent) => {
  const servicedEvent = {
    service: 'relevance_rating',
    ...event,
  };
  track(servicedEvent);
};

const track = (eventProps: LoggerEvent) => {
  const toggles = document.cookie.split(';').reduce(function(acc, cookie) {
    const parts = cookie.split('=');
    const key = parts[0].trim();
    const value = parts[1].trim();

    if (key.match('toggle_')) {
      acc[key] = value;
    }
    return acc;
  }, {});

  const { event, ...restOfEvent } = eventProps;

  window.analytics.track(event, {
    ...restOfEvent,
    toggles,
  });
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

export { trackSearch };
export { trackRelevanceRating };
export { TrackerScript };
