import { getCookie } from 'cookies-next';
import cookies from '@weco/common/data/cookies';
import Router from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { v4 as uuidv4 } from 'uuid';
import { PageviewName } from '@weco/content/data/segment-values';
declare global {
  interface Window {
    // Segment.io requires `analytics: any;`
    // https://ashokraju.medium.com/using-segment-io-analytics-js-with-single-page-react-typescript-app-a8c12b4816c4
    // eslint-disable-next-line
    analytics: any;
    // eslint-disable-next-line
    dataLayer: Record<string, any>[] | undefined;
  }
}

type Page = {
  path: string;
  name: string;
  query: ParsedUrlQuery;
};

type ConversionType = 'pageview' | 'event';
type EventGroup = 'conversion' | 'similarity';

interface Conversion {
  type: ConversionType;
  source?: string;
  page: Page;
  properties: {
    [key: string]: unknown;
  };
  eventGroup: EventGroup;
}

type Session = {
  id: string;
  timeout: number;
};

type EventProps = {
  name: string;
  properties: { [key: string]: unknown };
  eventGroup?: EventGroup;
};

export type Pageview = {
  name: PageviewName;
  properties: Record<string, string[] | number[] | string | number | undefined>;
  eventGroup?: EventGroup;
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
function trackPageview({
  name,
  properties,
  eventGroup = 'conversion',
}: EventProps): void {
  // Source is passed in the querystring in the app, but not the client.
  // e.g. /common/views/component/WorkLink/WorkLink.tsx
  const { source, ...query } = Router.query;
  pageName = name;

  const conversion: Conversion = {
    type: 'pageview',
    source: source?.toString() || 'unknown',
    eventGroup,
    page: {
      path: Router.asPath,
      name,
      query,
    },
    properties,
  };

  track(conversion);
}

function trackSegmentEvent({
  name,
  properties,
  eventGroup = 'conversion',
}: EventProps): void {
  track({
    type: 'event',
    eventGroup,
    page: {
      path: Router.asPath,
      name: pageName,
      query: Router.query,
    },
    properties: { event: name, ...properties },
  });
}

function track(conversion: Conversion) {
  const debug = getCookie(cookies.analyticsDebug) === true;
  // We make toggles available of the dataLayer for GTM, so can use them here too
  const togglesString = window?.dataLayer?.find(data => data.toggles)?.toggles;
  const toggles = togglesString ? togglesString.split(',') : [];
  const sessionId = getSessionId();
  const session: Session = {
    id: sessionId,
    timeout: sessionTimeout,
  };
  const { eventGroup, properties, ...restConversion } = conversion;

  localStorage.setItem(lastTrackedLocalStorageKey, Date.now().toString());

  if (debug) {
    console.info(eventGroup, {
      session,
      properties: { ...properties, toggles },
      ...restConversion,
    });
  }

  window.analytics.track(eventGroup, {
    session,
    properties: { ...properties, toggles },
    ...restConversion,
  });
}

export { trackPageview, trackSegmentEvent };
