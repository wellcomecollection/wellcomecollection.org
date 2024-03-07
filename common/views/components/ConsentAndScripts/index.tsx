import Head from 'next/head';
import { useEffect, useState } from 'react';
import CivicUK from './ConsentAndScripts.CivicUK';
import { getAnalyticsConsentState } from '@weco/common/services/app/civic-uk';

const ConsentAndScripts = ({ segmentSnippet }: { segmentSnippet: string }) => {
  const [consentState, setConsentState] = useState(false);

  const onAnalyticsConsentChanged = (event: CustomEvent) => {
    // Toggle rendering of scripts
    setConsentState(event.detail.consent === 'granted');

    // Update datalayer config with consent value
    gtag('consent', 'update', {
      ad_storage: event.detail.consent,
      analytics_storage: event.detail.consent,
    });
  };

  useEffect(() => {
    setConsentState(getAnalyticsConsentState());

    window.addEventListener(
      'analyticsConsentChanged',
      onAnalyticsConsentChanged
    );

    return () => {
      window.removeEventListener(
        'analyticsConsentChanged',
        onAnalyticsConsentChanged
      );
    };
  }, []);

  return (
    <>
      {consentState && (
        <Head>
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
          <script dangerouslySetInnerHTML={{ __html: segmentSnippet }} />
        </Head>
      )}

      <CivicUK />
    </>
  );
};

export default ConsentAndScripts;
