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

const INACTIVITY_TIMEOUT = 60; // 60 seconds of inactivity before showing the warning modal
const WARNING_COUNTDOWN = 30; // 30 seconds countdown before redirect

const InactivityRedirect: FunctionComponent = () => {
  const { isKiosk, kioskHomeUrl } = useKiosk();
  const router = useRouter();
  const [isWarningActive, setIsWarningActive] = useState(false);
  const [countdown, setCountdown] = useState(WARNING_COUNTDOWN);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const redirectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const modalButtonRef = useRef<HTMLElement | null>(null);

  // Don't run on the redirect destination itself
  const isRedirectDestination = router.asPath === kioskHomeUrl;

  const performRedirect = useCallback(
    ({ isAutomated }: { isAutomated: boolean }) => {
      setIsWarningActive(false);

      if (isAutomated) {
        gtag('event', 'auto_reset');
      }

      router.push(kioskHomeUrl);
    },
    [router, kioskHomeUrl]
  );

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    if (isWarningActive) return;

    inactivityTimerRef.current = setTimeout(() => {
      setIsWarningActive(true);
      setCountdown(WARNING_COUNTDOWN);
    }, INACTIVITY_TIMEOUT * 1000);
  }, [isWarningActive]);

  const handleCancelRedirect = useCallback(() => {
    setIsWarningActive(false);
    setCountdown(WARNING_COUNTDOWN);

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
      setCountdown(WARNING_COUNTDOWN);

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
        performRedirect({ isAutomated: true });
      }, WARNING_COUNTDOWN * 1000);

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
      removeCloseButton={true}
    >
      <InactivityRedirectModal
        countdown={countdown}
        warningCountdown={WARNING_COUNTDOWN}
        onKeepBrowsing={handleCancelRedirect}
        onReset={() => performRedirect({ isAutomated: false })}
      />
    </Modal>
  );
};

export default InactivityRedirect;
