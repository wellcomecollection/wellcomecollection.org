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

type ConversionType = 'pageview' | 'event';

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

export type Pageview = {
  name: string;
  properties: Record<string, string[] | number[] | string | number | undefined>;
};

const sessionIdLocalStorageKey = 'sessionId';
const lastTrackedLocalStorageKey = 'lastTracked';
const sessionTimeout = 1000 * 60 * 30; // 30 minutes
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

let pageName: string;
function trackPageview(
  name: string,
  properties: { [key: string]: unknown }
): void {
  // Source is passed in the querystring in the app, but not the client.
  // e.g. /common/views/component/WorkLink/WorkLink.tsx
  const { source, ...query } = Router.query;
  pageName = name;

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

type EventName = 'download';
function trackEvent(
  name: EventName,
  properties: { [key: string]: unknown }
): void {
  track({
    type: 'event',
    page: {
      path: Router.asPath,
      pathname: Router.pathname,
      name: pageName,
      query: Router.query,
    },
    properties: { event: name, ...properties },
  });
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
    console.info({
      session,
      ...conversion,
    });
  }

  window.analytics.track('conversion', {
    session,
    ...conversion,
  });
}

export { trackPageview, trackEvent };
