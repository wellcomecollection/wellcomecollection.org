import cookies from 'next-cookies';
import Router from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { v4 as uuidv4 } from 'uuid';

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

type Session = {
  id: string;
  timeout: number;
};

const sessionIdLocalStorageKey = 'sessionId';
const lastTrackedLocalStorageKey = 'lastTracked';
const sessionTimeout = 1000 * 60 * 0.1; // 30 minutes
function getSessionId(): string {
  const lsSessionId = localStorage.getItem(sessionIdLocalStorageKey);
  const lsLastTracked = localStorage.getItem(lastTrackedLocalStorageKey);

  if (lsLastTracked) {
    const now = Date.now();
    const diff = now - parseInt(lsLastTracked, 10);

    if (diff >= sessionTimeout) {
      return resetSessionId();
    }
  }

  if (lsSessionId) {
    return lsSessionId;
  }

  return resetSessionId();
}

function resetSessionId(): string {
  const sessionId = uuidv4();
  localStorage.setItem(sessionIdLocalStorageKey, sessionId);
  return sessionId;
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
  const debug = Boolean(cookies({}).analytics_debug);
  const sessionId = getSessionId();
  const session: Session = {
    id: sessionId,
    timeout: sessionTimeout,
  };

  localStorage.setItem(lastTrackedLocalStorageKey, Date.now().toString());

  if (debug) {
    console.info(sessionId, conversion);
  }

  window.analytics.track('conversion', {
    session,
    ...conversion,
  });
}
