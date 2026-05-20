import { useRouter } from 'next/router';
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';

import { useKiosk } from '@weco/common/contexts/KioskContext';
import Modal from '@weco/common/views/components/Modal';

const INACTIVITY_TIMEOUT = 30 * 1000; // 30 seconds
const WARNING_COUNTDOWN = 30; // 30 seconds countdown before redirect

const RedirectModalContent = styled.div`
  padding: 24px;
  text-align: center;

  p {
    margin: 16px 0;
    font-size: 18px;
    line-height: 1.5;
  }
`;

const RedirectModalTitle = styled.h2`
  font-size: 32px;
  font-weight: bold;
  margin: 0 0 24px;
`;

const CountdownText = styled.strong`
  font-size: 24px;
  font-weight: bold;
`;

type Props = {
  redirectUrl: string;
};

const InactivityRedirect: FunctionComponent<Props> = ({ redirectUrl }) => {
  const isKiosk = useKiosk();
  const router = useRouter();
  const [isWarningActive, setIsWarningActive] = useState(false);
  const [countdown, setCountdown] = useState(WARNING_COUNTDOWN);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const redirectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const modalButtonRef = useRef<HTMLElement | null>(null);

  // Don't run on the redirect destination itself
  const isRedirectDestination = router.asPath === redirectUrl;

  const performRedirect = useCallback(() => {
    setIsWarningActive(false);
    router.push(redirectUrl);
  }, [router, redirectUrl]);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    if (isWarningActive) return;

    inactivityTimerRef.current = setTimeout(() => {
      setIsWarningActive(true);
      setCountdown(WARNING_COUNTDOWN);
    }, INACTIVITY_TIMEOUT);
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
    if (isWarningActive) {
      handleCancelRedirect();
    } else {
      resetInactivityTimer();
    }
  }, [isWarningActive, handleCancelRedirect, resetInactivityTimer]);

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
        performRedirect();
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
      <RedirectModalContent>
        <RedirectModalTitle>Are you still there?</RedirectModalTitle>
        <p>
          Due to inactivity, you will be redirected in{' '}
          <CountdownText>{countdown}</CountdownText> second
          {countdown !== 1 ? 's' : ''}.
        </p>
        <p>Tap the screen to stay on this page.</p>
      </RedirectModalContent>
    </Modal>
  );
};

export default InactivityRedirect;
