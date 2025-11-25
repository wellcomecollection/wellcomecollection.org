import { FunctionComponent, useEffect, useState } from 'react';

import {
  CookieConsentEvent,
  getConsentState,
} from '@weco/common/services/app/civic-uk';

declare global {
  interface Window {
    __hotjarRequested?: boolean;
  }
}

const HOTJAR_ID = 3858;
const HOTJAR_SV = 6;

export const HotjarLoader: FunctionComponent = () => {
  const [hasConsent, setHasConsent] = useState<boolean>(false);
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
  const [isRequested, setIsRequested] = useState<boolean>(false);

  useEffect(() => {
    // Check initial consent state from cookie
    const initialConsent = getConsentState('analytics');
    setHasConsent(initialConsent);

    // Listen for consent changes
    const handleConsentChange = (event: CookieConsentEvent) => {
      if (event.detail.analyticsConsent === 'granted') {
        setHasConsent(true);
      } else if (event.detail.analyticsConsent === 'denied') {
        setHasConsent(false);
      }
    };

    // Check if already requested before listener was added
    if (window.__hotjarRequested) {
      setIsRequested(true);
    }

    // Listen for pages requesting Hotjar
    const handleHotjarRequest = () => {
      setIsRequested(true);
    };

    window.addEventListener(
      'consentChanged',
      handleConsentChange as EventListener
    );
    window.addEventListener('requestHotjar', handleHotjarRequest);

    return () => {
      window.removeEventListener(
        'consentChanged',
        handleConsentChange as EventListener
      );
      window.removeEventListener('requestHotjar', handleHotjarRequest);
    };
  }, []);

  useEffect(() => {
    // Only load script if we have consent, it's been requested, and haven't loaded it yet
    if (hasConsent && isRequested && !scriptLoaded) {
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
  }, [hasConsent, isRequested, scriptLoaded]);

  // This component doesn't render anything
  return null;
};
