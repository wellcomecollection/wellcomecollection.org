import { FunctionComponent } from 'react';

import { ConsentStatusProps } from '@weco/common/server-data/types';
import { Toggles } from '@weco/toggles';

// Don't use the next/script `Script` component for these as in
// Next.js v11 it does not work when inside a `Head` component
type Props = {
  data: {
    toggles?: Toggles;
  };
  consentStatus: ConsentStatusProps;
};

// We send toggles as an event parameter to GA4 so we can determine the condition in which a particular event took place.
// GA4 now limits event parameter values to 100 characters: https://support.google.com/analytics/answer/9267744?hl=en
// So instead of sending the whole toggles JSON blob, we only look at the "test" typed toggles and send a concatenated string made of the toggles' name
// , preceeded with a! if its value is false.
function createABToggleString(toggles: Toggles | undefined): string | null {
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

export const Ga4DataLayer: FunctionComponent<Props> = ({
  data,
  consentStatus,
}) => {
  const abTestsToggleString = createABToggleString(data.toggles);

  return (
    <script
      id="google-analytics-data-layer"
      dangerouslySetInnerHTML={{
        __html: `
            window.dataLayer = window.dataLayer || [];

            function gtag(){window.dataLayer.push(arguments);}
              
            gtag('consent', 'default', {
              'analytics_storage': ${
                consentStatus.analytics ? '"granted"' : '"denied"'
              },
              'ad_storage': ${
                consentStatus.marketing ? '"granted"' : '"denied"'
              },
              'ad_user_data':  ${
                consentStatus.marketing ? '"granted"' : '"denied"'
              },
              'ad_personalization':  ${
                consentStatus.marketing ? '"granted"' : '"denied"'
              },
            });

            ${
              abTestsToggleString &&
              `window.dataLayer.push({
                toggles: '${abTestsToggleString}'
              });`
            }
          `,
      }}
    />
  );
};

export const GoogleTagManager: FunctionComponent = () => (
  <script
    id="google-tag-manager"
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
