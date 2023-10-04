import { FunctionComponent, useEffect } from 'react';
import ReactGA from 'react-ga';
import { Toggles } from '@weco/toggles';

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
type Props = {
  data: {
    toggles?: Toggles;
  };
};

// We send toggles as an event parameter to GA4 so we can determine the condition in which a particular event took place.
// GA4 now limits event parameter values to 100 characters: https://support.google.com/analytics/answer/9267744?hl=en
// So instead of sending the whole toggles JSON blob, we only look at the "test" typed toggles and send a concatenated string made of the toggles' name
// , preceeded with a! if its value is false.
function createToggleString(toggles: Toggles | undefined): string | null {
  const testToggles = toggles
    ? Object.keys(toggles).reduce((acc, key) => {
        if (toggles?.[key].type === 'test') {
          acc[key] = toggles?.[key].value;
        }
        return acc;
      }, {})
    : null;
  return testToggles
    ? Object.keys(testToggles)
        .map(toggle => {
          switch (testToggles[toggle]) {
            case true:
              return toggle;
            case false:
              return `!${toggle}`;
            default:
              return null;
          }
        })
        .join(',')
    : null;
}

export const Ga4DataLayer: FunctionComponent<Props> = ({ data }) => {
  const toggleString = createToggleString(data.toggles);

  return toggleString ? (
    <script
      dangerouslySetInnerHTML={{
        __html: `
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          toggles: '${toggleString}'
        });
        `,
      }}
    />
  ) : null;
};

export const GoogleTagManager: FunctionComponent = () => (
  <script
    dangerouslySetInnerHTML={{
      __html: `
          (function(w,d,s,l,i){w[l] = w[l] || [];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-53DFWQD');`,
    }}
  />
);

export const GoogleTagManagerNoScript: FunctionComponent = () => (
  <noscript>
    <iframe
      src="https://www.googletagmanager.com/ns.html?id=GTM-53DFWQD"
      height="0"
      width="0"
      style={{ display: 'none', visibility: 'hidden' }}
    ></iframe>
  </noscript>
);

export const GoogleAnalyticsUA: FunctionComponent = () => (
  <script
    id="google-analytics-ua"
    dangerouslySetInnerHTML={{
      // we don't initialize analytics here, as that is done by ReactGA
      // See `useGoogleAnalyticsUA`
      __html: `
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());`,
    }}
  />
);

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
