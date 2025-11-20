import { FunctionComponent, useEffect, useState } from 'react';

import { getConsentState } from '@weco/common/services/app/civic-uk';

type ConsentChangedEvent = CustomEvent<{
  analyticsConsent?: 'granted' | 'denied';
  marketingConsent?: 'granted' | 'denied';
}>;

const HOTJAR_ID = 3858;
const HOTJAR_SV = 6;

/**
 * Client-side component that dynamically loads Hotjar based on analytics consent.
 * Listens for consent changes and loads/manages Hotjar accordingly.
 */
export const HotjarLoader: FunctionComponent = () => {
  const [hasConsent, setHasConsent] = useState<boolean>(false);
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Check initial consent state from cookie
    const initialConsent = getConsentState('analytics');
    setHasConsent(initialConsent);

    // Listen for consent changes
    const handleConsentChange = (event: ConsentChangedEvent) => {
      if (event.detail.analyticsConsent === 'granted') {
        setHasConsent(true);
      } else if (event.detail.analyticsConsent === 'denied') {
        setHasConsent(false);
      }
    };

    window.addEventListener(
      'consentChanged',
      handleConsentChange as EventListener
    );

    return () => {
      window.removeEventListener(
        'consentChanged',
        handleConsentChange as EventListener
      );
    };
  }, []);

  useEffect(() => {
    // Only load script if we have consent and haven't loaded it yet
    if (hasConsent && !scriptLoaded) {
      // Check if Hotjar is already loaded
      if ('hj' in window) {
        setScriptLoaded(true);
        return;
      }

      // Load Hotjar dynamically
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (function (h: any, o: Document, t: string, j: string) {
        h.hj =
          h.hj ||
          function (...args: unknown[]) {
            (h.hj.q = h.hj.q || []).push(args);
          };
        h._hjSettings = { hjid: HOTJAR_ID, hjsv: HOTJAR_SV };
        const a = o.getElementsByTagName('head')[0];
        const r = o.createElement('script');
        r.async = true;
        r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
        r.onload = () => setScriptLoaded(true);
        a.appendChild(r);
      })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
    }
  }, [hasConsent, scriptLoaded]);

  // This component doesn't render anything
  return null;
};
