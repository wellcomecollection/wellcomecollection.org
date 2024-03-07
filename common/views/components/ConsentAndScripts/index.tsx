import Head from 'next/head';
import { useEffect, useState } from 'react';
import CivicUK from './ConsentAndScripts.CivicUK';
import { getAnalyticsConsentState } from '@weco/common/services/app/civic-uk';

const ConsentAndScripts = ({ segmentSnippet }: { segmentSnippet: string }) => {
  const [consentState, setConsentState] = useState(false);

  const onAnalyticsConsentAccepted = () => {
    // Add scripts
    setConsentState(true);

    // Update datalayer config to add consent
    gtag('consent', 'update', {
      ad_storage: 'granted',
      analytics_storage: 'granted',
    });
  };

  const onAnalyticsConsentRejected = () => {
    // Remove scripts
    setConsentState(false);

    // Update datalayer config to remove consent
    gtag('consent', 'update', {
      ad_storage: 'denied',
      analytics_storage: 'denied',
    });
  };

  useEffect(() => {
    setConsentState(getAnalyticsConsentState());

    window.addEventListener(
      'analyticsConsentAccepted',
      onAnalyticsConsentAccepted
    );
    window.addEventListener(
      'analyticsConsentRejected',
      onAnalyticsConsentRejected
    );

    return () => {
      window.removeEventListener(
        'analyticsConsentAccepted',
        onAnalyticsConsentAccepted
      );
      window.removeEventListener(
        'analyticsConsentRejected',
        onAnalyticsConsentRejected
      );
    };
  }, []);

  return (
    <>
      {consentState && (
        <Head>
          <>
            {/* Adding toggles etc. to the datalayer so they are available to events in Google Tag Manager */}
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
          </>
        </Head>
      )}

      <CivicUK />
    </>
  );
};

export default ConsentAndScripts;
