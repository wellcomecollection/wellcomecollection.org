// @flow
import { useEffect } from 'react';

type ResultListResource = {|
  type: 'ResultList',
  query: string,
  page: number,
  workType: ?(string[]),
|};

type WorkResource = {|
  type: 'Work',
  id: string,
  title: string,
|};

type ItemResource = {|
  type: 'Item',
  id: string,
  title: string,
|};

type AnalyticsResource = ResultListResource | WorkResource | ItemResource;

export type AnalyticsEvent = {|
  event: string,
  service: 'search_logs',
  resource: AnalyticsResource,
|};

export type RelevanceRating = {|
  position: number,
  id: string,
  rating: number,
|};

export type RelevanceEvent = {|
  event: string,
  service: 'relevance_rating',
  rating: RelevanceRating,
|};

type LoggerEvents = AnalyticsEvent | RelevanceEvent;

// This is global to stop the script loading when the component is used in
// multiple places through the app
let loaded = false;
let segment;

const cachedEvents = [];

const track = (event: LoggerEvents) => {
  if (segment) {
    const toggles = document.cookie.split(';').reduce(function(acc, cookie) {
      const parts = cookie.split('=');
      const key = parts[0].trim();
      const value = parts[1].trim();

      if (key.match('toggle_')) {
        acc[key] = value;
      }
      return acc;
    }, {});

    const query = Array.from(
      new URLSearchParams(window.location.search)
    ).reduce(function(acc, keyVal) {
      acc[keyVal[0]] = keyVal[1];
      return acc;
    }, {});

    segment.track({
      ...event,
      toggles,
      query,
    });
  } else {
    cachedEvents.push(event);
  }
};

const SearchLoggerScript = () => {
  useEffect(() => {
    if (!loaded) {
      const script = document.createElement('script');
      script.id = 'search-logger';
      script.src = `https://cdn.segment.com/analytics.js/v1/78Czn5jNSaMSVrBq2J9K4yJjWxh6fyRI/analytics.min.js`;
      script.async = true;
      script.onload = () => {
        segment = window.analytics;
        cachedEvents.forEach(event => {
          track(event);
        });
        loaded = true;
      };
      document.body && document.body.appendChild(script);
    }
  }, []);

  return null;
};

export { track };
export { SearchLoggerScript };
