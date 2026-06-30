import { useRouter } from 'next/router';
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useKiosk } from '@weco/common/contexts/KioskContext';
import { useNavigationHistory } from '@weco/common/hooks/useNavigationHistory';
import Modal from '@weco/common/views/components/Modal';

import InactivityRedirectModal from './InactivityRedirect.Modal';

const INACTIVITY_TIMEOUT = 60; // 60 seconds of inactivity before showing the warning modal
const WARNING_COUNTDOWN = 30; // 30 seconds countdown before redirect

const InactivityRedirect: FunctionComponent<{ isCardiganStory?: boolean }> = ({
  isCardiganStory,
}) => {
  const { isKiosk, isDevModeKiosk, kioskHomepageUrl } = useKiosk();
  const { reset: resetNavigationHistory } = useNavigationHistory();
  const router = useRouter();
  const [isWarningActive, setIsWarningActive] = useState(false);
  const [countdown, setCountdown] = useState(WARNING_COUNTDOWN);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const redirectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const modalButtonRef = useRef<HTMLElement | null>(null);

  // Don't run outside kiosk mode, on the redirect destination itself, or if in developer mode
  // Strip query parameters when checking if we're on the homepage (e.g. kp_zoomLevel=100)
  const currentPathWithoutQuery = router.asPath.split('?')[0];
  const homepagePathWithoutQuery = kioskHomepageUrl?.split('?')[0];
  const isRedirectDestination =
    currentPathWithoutQuery === homepagePathWithoutQuery;
  const shouldNotBeActive =
    (!isKiosk ||
      isDevModeKiosk ||
      !kioskHomepageUrl ||
      isRedirectDestination) &&
    !isCardiganStory;

  const performRedirect = useCallback(
    ({ isAutomated }: { isAutomated: boolean }) => {
      setIsWarningActive(false);

      // Don't redirect if kioskHomepageUrl is not defined (e.g., in Cardigan/Storybook)
      if (!kioskHomepageUrl) {
        return;
      }

      if (isAutomated) {
        gtag('event', 'auto_reset');
      }

      // Clear navigation history to start fresh
      resetNavigationHistory();

      // Append kp_zoomLevel=100 to reset zoom in Kiosk Pro browser
      const separator = kioskHomepageUrl.includes('?') ? '&' : '?';
      const urlWithZoomReset = `${kioskHomepageUrl}${separator}kp_zoomLevel=100`;

      router.push(urlWithZoomReset);
    },
    [router, kioskHomepageUrl, resetNavigationHistory]
  );

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    if (isWarningActive) return;

    inactivityTimerRef.current = setTimeout(
      () => {
        setIsWarningActive(true);
        setCountdown(WARNING_COUNTDOWN);
      },
      isCardiganStory ? 100 : INACTIVITY_TIMEOUT * 1000
    );
  }, [isWarningActive, isCardiganStory]);

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
    if (shouldNotBeActive) return;

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
  }, [router, shouldNotBeActive]);

  // Countdown and redirect when warning is active
  useEffect(() => {
    if (shouldNotBeActive) return;

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
  }, [shouldNotBeActive, isWarningActive, performRedirect]);

  // Set up activity listeners
  useEffect(() => {
    if (shouldNotBeActive) return;

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
    shouldNotBeActive,
    isWarningActive,
    handleUserActivity,
    resetInactivityTimer,
  ]);

  if (shouldNotBeActive) return null;

  return (
    <Modal
      data-component="inactivity-redirect"
      isActive={isWarningActive}
      setIsActive={handleCancelRedirect}
      id="kiosk-inactivity-warning"
      openButtonRef={modalButtonRef}
      showOverlay={true}
      modalStyle="inactivity"
      maxWidth="550px"
    >
      <InactivityRedirectModal
        countdown={countdown}
        onKeepBrowsing={handleCancelRedirect}
        onReset={() => performRedirect({ isAutomated: false })}
      />
    </Modal>
  );
};

export default InactivityRedirect;
