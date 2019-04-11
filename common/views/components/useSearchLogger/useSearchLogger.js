// @flow
import { useEffect, useState } from 'react';

type AnalyticsResource = {|
  title: string,
  id: string,
  type: 'Work' | 'ResultList' | 'Item',
|};

export type AnalyticsEvent = {|
  event: string,
  service: 'search_logs',
  resource: AnalyticsResource,
|};

// This is global to stop the script loading when the component is used in
// multiple places through the app
let loaded = false;
const cachedEvents = [];
const track = (segment: any, event: AnalyticsEvent) => {
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

    // segment.track({
    //   ...event,
    //   toggles,
    //   query,
    // });
    console.info({
      ...event,
      toggles,
      query,
    });
  } else {
    cachedEvents.push(event);
  }
};
const segmentId = '78Czn5jNSaMSVrBq2J9K4yJjWxh6fyRI';
const useSearchLogger = () => {
  const [segment, setSegment] = useState(null);

  useEffect(() => {
    if (!loaded) {
      const script = document.createElement('script');
      script.id = 'search-logger';
      script.src = `https://cdn.segment.com/analytics.js/v1/${segmentId}/analytics.min.js`;
      script.async = true;
      script.onload = () => {
        setSegment(window.analytics);
        cachedEvents.forEach(event => {
          track(window.analytics, event);
        });
      };
      document.body && document.body.appendChild(script);
      loaded = true;
    } else {
      setSegment(window.analytics);
    }
  }, []);

  return {
    track: (event: AnalyticsEvent) => {
      track(segment, event);
    },
  };
};

export default useSearchLogger;
