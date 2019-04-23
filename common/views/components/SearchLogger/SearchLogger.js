// @flow
import { useEffect } from 'react';

export const SearchLoggerEvents = {
  CatalogueViewWork: 'Catalogue View Work',
  CatalogueSearch: 'Catalogue Search',
  CatalogueLanding: 'Catalogue Landing',
};
type SearchLoggerEvent = $Values<typeof SearchLoggerEvents>;

type ResultListResource = {|
  type: 'ResultList',
  query: string,
  page: number,
  workType: ?(string[]),
|};

type WorkResultResource = {|
  type: 'Work',
  id: string,
  title: string,
  position: number,
  page: number,
  query: string,
  workType: ?(string[]),
|};

type AnalyticsResource = ResultListResource | WorkResultResource;

export type AnalyticsEvent = {|
  service: 'search_logs',
  resource: AnalyticsResource,
|};

const track = (name: SearchLoggerEvent, event: AnalyticsEvent) => {
  const toggles = document.cookie.split(';').reduce(function(acc, cookie) {
    const parts = cookie.split('=');
    const key = parts[0] && parts[0].trim();
    const value = parts[1] && parts[1].trim();

    if (key && key.match('toggle_')) {
      acc[key] = value;
    }
    return acc;
  }, {});

  const query = Array.from(new URLSearchParams(window.location.search)).reduce(
    function(acc, keyVal) {
      acc[keyVal[0]] = keyVal[1];
      return acc;
    },
    {}
  );

  window.analytics.track(name, {
    ...event,
    toggles,
    query,
  });
};

const SearchLoggerScript = () => {
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

export { track };
export { SearchLoggerScript };
