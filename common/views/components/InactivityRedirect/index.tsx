import { useRouter } from 'next/router';
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useKiosk } from '@weco/common/contexts/KioskContext';
import Modal from '@weco/common/views/components/Modal';

import InactivityRedirectModal from './InactivityRedirect.Modal';

const DEFAULT_INACTIVITY_TIMEOUT = 30 * 1000; // 30 seconds
const DEFAULT_WARNING_COUNTDOWN = 30; // 30 seconds countdown before redirect

type Props = {
  redirectUrl: string;
  inactivityTimeout?: number;
  warningCountdown?: number;
};

const InactivityRedirect: FunctionComponent<Props> = ({
  redirectUrl,
  inactivityTimeout = DEFAULT_INACTIVITY_TIMEOUT,
  warningCountdown = DEFAULT_WARNING_COUNTDOWN,
}) => {
  const isKiosk = useKiosk();
  const router = useRouter();
  const [isWarningActive, setIsWarningActive] = useState(false);
  const [countdown, setCountdown] = useState(warningCountdown);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const redirectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const modalButtonRef = useRef<HTMLElement | null>(null);

  // Don't run on the redirect destination itself
  const isRedirectDestination = router.asPath === redirectUrl;

  const performRedirect = useCallback(() => {
    setIsWarningActive(false);

    gtag('event', 'auto_reset');

    router.push(redirectUrl);
  }, [router, redirectUrl]);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    if (isWarningActive) return;

    inactivityTimerRef.current = setTimeout(() => {
      setIsWarningActive(true);
      setCountdown(warningCountdown);
    }, inactivityTimeout);
  }, [isWarningActive, inactivityTimeout, warningCountdown]);

  const handleCancelRedirect = useCallback(() => {
    setIsWarningActive(false);
    setCountdown(warningCountdown);

    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    if (redirectTimerRef.current) {
      clearTimeout(redirectTimerRef.current);
      redirectTimerRef.current = null;
    }

    resetInactivityTimer();
  }, [resetInactivityTimer]);

  const handleUserActivity = useCallback(() => {
    if (isWarningActive) return;

    resetInactivityTimer();
  }, [isWarningActive, resetInactivityTimer]);

  // Clean up on route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setIsWarningActive(false);
      setCountdown(warningCountdown);

      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
        redirectTimerRef.current = null;
      }
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  // Countdown and redirect when warning is active
  useEffect(() => {
    if (isWarningActive) {
      countdownTimerRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            if (countdownTimerRef.current) {
              clearInterval(countdownTimerRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      redirectTimerRef.current = setTimeout(() => {
        performRedirect();
      }, warningCountdown * 1000);

      return () => {
        if (countdownTimerRef.current) {
          clearInterval(countdownTimerRef.current);
        }
        if (redirectTimerRef.current) {
          clearTimeout(redirectTimerRef.current);
        }
      };
    }
  }, [isWarningActive, performRedirect]);

  // Set up activity listeners
  useEffect(() => {
    if (!isKiosk || isRedirectDestination) return;

    if (isWarningActive) {
      return;
    }

    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click',
    ];

    events.forEach(event => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });

    resetInactivityTimer();

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });

      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, [
    isKiosk,
    isRedirectDestination,
    isWarningActive,
    handleUserActivity,
    resetInactivityTimer,
  ]);

  if (!isKiosk || isRedirectDestination) {
    return null;
  }

  return (
    <Modal
      data-component="inactivity-redirect"
      isActive={isWarningActive}
      setIsActive={handleCancelRedirect}
      id="kiosk-inactivity-warning"
      openButtonRef={modalButtonRef}
      showOverlay={true}
    >
      <InactivityRedirectModal
        countdown={countdown}
        warningCountdown={warningCountdown}
        onKeepBrowsing={handleCancelRedirect}
        onReset={performRedirect}
      />
    </Modal>
  );
};

export default InactivityRedirect;
