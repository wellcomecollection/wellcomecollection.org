import { FunctionComponent, useEffect } from 'react';
import ReactGA from 'react-ga';
import { Toggles } from '@weco/toggles';
import Script from 'next/script';

export const GOOGLE_ANALYTICS_V4_ID = 'G-206J7SLYFC';
export const GOOGLE_ANALYTICS_UA_ID = 'UA-55614-6';

const gaCookieFlags = 'SameSite=None;secure';

export type GaDimensions = {
  partOf: string[];
};

const gaDimensionKeys = {
  partOf: 'dimension3',
};

// Don't use the next/script `Script` component for these as in
// Next.js v11 it does not work when inside a `Head` component
export const GoogleAnalyticsV4: FunctionComponent = () => (
  <script
    id="google-analytics-v4"
    src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_V4_ID}`}
    async={true}
  />
);

export const GoogleAnalyticsUA: FunctionComponent = () => (
  <script
    id="google-analytics-ua"
    async={true}
    dangerouslySetInnerHTML={{
      // we don't initialize analytics here, as that is done by ReactGA
      // See `useGoogleAnalyticsUA`
      __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());`,
    }}
  />
);

export const useGoogleAnalyticsV4 = (): void =>
  useEffect(() => {
    if (window?.gtag) {
      const path = window.location.pathname + window.location.search;
      window.gtag('config', GOOGLE_ANALYTICS_V4_ID, {
        page_path: path,
        cookie_flags: gaCookieFlags,
      });
    }
  }, []);

export const useGoogleAnalyticsUA = ({
  toggles,
  gaDimensions,
}: {
  toggles: Toggles;
  gaDimensions?: GaDimensions;
}): void =>
  useEffect(() => {
    ReactGA.initialize([
      {
        trackingId: GOOGLE_ANALYTICS_UA_ID,
        titleCase: false,
        gaOptions: { cookieFlags: gaCookieFlags },
      },
    ]);

    // This allows us to send a gaDimensions prop from a data fetching method
    // e.g. `getServerSideProps` and store it in the page views.
    // TODO: Probably best moving this into the PageLayout so it's called explicitly.
    if (gaDimensions?.partOf?.length) {
      ReactGA.set({
        [gaDimensionKeys.partOf]: gaDimensions.partOf.join(','),
      });
    }

    ReactGA.set({
      dimension5: JSON.stringify(toggles),
    });
  }, []);
