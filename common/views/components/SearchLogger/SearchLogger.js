// @flow
import { useEffect, useState } from 'react';
import Router from 'next/router';

const segmentId = '78Czn5jNSaMSVrBq2J9K4yJjWxh6fyRI';

function routeChangeComplete(analytics) {
  return url => {
    if (
      window.location.pathname.match('/works') &&
      'URLSearchParams' in window
    ) {
      const workPageMatch = window.location.pathname.match(
        /^\/works\/([a-z0-9]+)$/
      );
      const itemPageMatch = window.location.pathname.match(
        /^\/works\/([a-z0-9]+)\/items$/
      );
      const query = Array.from(
        new URLSearchParams(window.location.search)
      ).reduce(function(acc, keyVal) {
        acc[keyVal[0]] = keyVal[1];
        return acc;
      }, {});
      const toggles = document.cookie.split(';').reduce(function(acc, cookie) {
        const parts = cookie.split('=');
        const key = parts[0].trim();
        const value = parts[1].trim();

        if (key.match('toggle_')) {
          acc[key] = value;
        }
        return acc;
      }, {});

      if (workPageMatch) {
        analytics.track('Catalogue View Work', {
          service: 'search_logs',
          resource: {
            type: 'Work',
            title: document.title.replace(' | Wellcome Collection', ''),
            id: workPageMatch[1],
          },
          query: query,
          toggles: toggles,
        });
      } else if (itemPageMatch) {
        analytics.track('Catalogue View Item', {
          service: 'search_logs',
          resource: {
            type: 'Item',
            title: document.title.replace(' | Wellcome Collection', ''),
            id: itemPageMatch[1],
          },
          query: query,
          toggles: toggles,
        });
      } else {
        analytics.track('Catalogue Search', {
          service: 'search_logs',
          resource: {
            type: 'ResultList',
          },
          query: query,
          toggles: toggles,
        });
      }
    }
  };
}

const SearchLogger = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://cdn.segment.com/analytics.js/v1/${segmentId}/analytics.min.js`;
    script.async = true;
    script.onload = () => setAnalytics(window.analytics);
    document.body && document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (analytics) {
      const func = routeChangeComplete(analytics);
      Router.events.on('routeChangeComplete', func);

      return () => {
        Router.events.off('routeChangeComplete', routeChangeComplete(func));
      };
    }
  }, [analytics]);

  return (
    <>
      <meta name="search-logger" content={segmentId} />
    </>
  );
};
export default SearchLogger;
