import Head from 'next/head';
import { useContext, useEffect, useState } from 'react';
import { Toggles } from '@weco/toggles';
import CivicUK from './ConsentAndScripts.CivicUK';
import ConfirmPopup from './ConsentAndScripts.Popup';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import { getAnalyticsConsentState } from '@weco/common/services/app/civic-uk';
import { createToggleString } from '@weco/common/services/app/google-analytics';

const ConsentAndScripts = ({
  toggles,
  segmentSnippet,
}: {
  toggles: Toggles;
  segmentSnippet: string;
}) => {
  const { displayCookiePreferencePopup, setDisplayCookiePreferencePopup } =
    useContext(AppContext);
  const [consentState, setConsentState] = useState(false);

  const onAnalyticsConsentAccepted = () => {
    // Have popup that says "Your cookie settings have been saved"
    setDisplayCookiePreferencePopup(true);

    // Add scripts
    setConsentState(true);
  };

  const onAnalyticsConsentRejected = () => {
    // Have popup that says "Your cookie settings have been saved"
    setDisplayCookiePreferencePopup(true);

    // Remove scripts
    setConsentState(false);
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

  // TODO do this better if it's something we want, check with Jason & with a11y considerations
  useEffect(() => {
    if (displayCookiePreferencePopup) {
      setTimeout(() => {
        setDisplayCookiePreferencePopup(false);
      }, 3000);
    }
  }, [displayCookiePreferencePopup]);

  const toggleString = createToggleString(toggles);
  return (
    <>
      {consentState && (
        <Head>
          <>
            {/* Adding toggles etc. to the datalayer so they are available to events in Google Tag Manager */}
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

      {/* This won't be allowed anymore surely, without JS? */}
      {/* <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-53DFWQD"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript> */}

      {displayCookiePreferencePopup && <ConfirmPopup />}
    </>
  );
};

export default ConsentAndScripts;
