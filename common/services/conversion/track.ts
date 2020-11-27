import Router from 'next/router';
import { ParsedUrlQuery } from 'querystring';

declare global {
  interface Window {
    analytics: any;
  }
}

type Page = {
  path: string;
  pathname: string;
  name: string;
  query: ParsedUrlQuery;
};

type ConversionType = 'pageview' | 'search result selected';

interface Conversion {
  type: ConversionType;
  source?: string;
  page: Page;
  properties: {
    [key: string]: unknown;
  };
}

function removeCacheValuesFromUrlQuery(query: ParsedUrlQuery) {
  // We remove these as they're added through the koa middleware
  // And we really don't want them.
  const {
    globalAlert,
    memoizedPrismic,
    openingTimes,
    popupDialog,
    toggles,
    ...restOfQuery
  } = query;

  return restOfQuery;
}

export function trackPageview(
  // router: Router,
  name: string,
  properties: { [key: string]: unknown }
): void {
  // Source is passed in the querystring in the app, but not the client.
  // e.g. /common/views/component/WorkLink/WorkLink.tsx
  const { source, ...query } = removeCacheValuesFromUrlQuery(Router.query);

  const conversion: Conversion = {
    type: 'pageview',
    source: source?.toString() || 'unknown',
    page: {
      path: Router.asPath,
      pathname: Router.pathname,
      name,
      query,
    },
    properties,
  };

  track(conversion);
}

function track(conversion: Conversion) {
  console.info(conversion);
  window.analytics.track('conversion', conversion);
}
