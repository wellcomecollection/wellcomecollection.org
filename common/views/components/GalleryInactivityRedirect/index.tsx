import { useRouter } from 'next/router';
import {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ServerDataContext,
  useToggles,
} from '@weco/common/server-data/Context';
import { GalleryExhibitionData } from '@weco/common/server-data/types';
import Modal from '@weco/common/views/components/Modal';

import {
  CountdownText,
  RedirectModalContent,
  RedirectModalTitle,
} from './GalleryInactivityRedirect.styles';

const INACTIVITY_TIMEOUT = 1 * 60 * 1000; // 10 minutes in milliseconds
const WARNING_COUNTDOWN = 30; // 30 seconds countdown before redirect

function findExhibitionIdFromUrl(
  currentUrl: string,
  exhibitionExtras: Record<string, GalleryExhibitionData>
): string | null {
  const normalizeUrl = (url: string) => {
    try {
      const decoded = decodeURIComponent(url.replace(/\+/g, ' '));
      return decoded.replace(/\/$/, '').toLowerCase();
    } catch {
      return url.replace(/\+/g, ' ').replace(/\/$/, '').toLowerCase();
    }
  };

  const normalizedCurrentUrl = normalizeUrl(currentUrl);

  for (const [exhibitionId, exhibition] of Object.entries(exhibitionExtras)) {
    // Check stories
    const hasStory = exhibition.stories.some(
      storyId =>
        normalizeUrl(`/stories/${storyId}`) === normalizedCurrentUrl ||
        normalizedCurrentUrl.includes(storyId)
    );
    if (hasStory) return exhibitionId;

    // Check works
    const hasWork = exhibition.works.some(
      workId =>
        normalizeUrl(`/works/${workId}`) === normalizedCurrentUrl ||
        normalizedCurrentUrl.includes(workId)
    );
    if (hasWork) return exhibitionId;

    // Check collection clusters
    const hasCluster = exhibition.collectionClusters.some(cluster => {
      const normalizedClusterUrl = normalizeUrl(cluster.url);
      return (
        normalizedClusterUrl === normalizedCurrentUrl ||
        normalizedClusterUrl.includes(normalizedCurrentUrl) ||
        normalizedCurrentUrl.includes(normalizedClusterUrl)
      );
    });
    if (hasCluster) return exhibitionId;
  }
  return null;
}

const GalleryInactivityRedirect: FunctionComponent = () => {
  const { inGallery = false } = useToggles();
  const serverData = useContext(ServerDataContext);
  const router = useRouter();
  const [isWarningActive, setIsWarningActive] = useState(false);
  const [countdown, setCountdown] = useState(WARNING_COUNTDOWN);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const redirectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const modalButtonRef = useRef<HTMLElement | null>(null);

  // Determine which exhibition we're viewing
  const currentExhibitionId = findExhibitionIdFromUrl(
    router.asPath,
    serverData.exhibitionExtras
  );

  // Don't run on the extras page (the redirect destination)
  const isExtrasPage = router.pathname.includes('/extras');

  const performRedirect = useCallback(() => {
    // Close the modal before redirecting
    setIsWarningActive(false);
    if (currentExhibitionId) {
      router.push(`/exhibitions/${currentExhibitionId}/extras`);
    } else {
      // Fallback to stories page if we can't determine the exhibition
      router.push('/stories');
    }
  }, [router, currentExhibitionId]);

  const resetInactivityTimer = useCallback(() => {
    // Clear existing timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    // Don't start a new timer if we're already showing the warning
    if (isWarningActive) return;

    // Start a new inactivity timer
    inactivityTimerRef.current = setTimeout(() => {
      setIsWarningActive(true);
      setCountdown(WARNING_COUNTDOWN);
    }, INACTIVITY_TIMEOUT);
  }, [isWarningActive]);

  const handleCancelRedirect = useCallback(() => {
    setIsWarningActive(false);
    setCountdown(WARNING_COUNTDOWN);

    // Clear countdown and redirect timers
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    if (redirectTimerRef.current) {
      clearTimeout(redirectTimerRef.current);
      redirectTimerRef.current = null;
    }

    // Restart inactivity tracking
    resetInactivityTimer();
  }, [resetInactivityTimer]);

  const handleUserActivity = useCallback(() => {
    if (isWarningActive) {
      // If warning is showing, cancel the redirect
      handleCancelRedirect();
    } else {
      // Otherwise, just reset the inactivity timer
      resetInactivityTimer();
    }
  }, [isWarningActive, handleCancelRedirect, resetInactivityTimer]);

  // Effect to clean up modal state when route changes
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

  // Effect to handle countdown and redirect when warning is active
  useEffect(() => {
    if (isWarningActive) {
      // Start countdown
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

      // Set redirect timer
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

  // Effect to set up activity listeners
  useEffect(() => {
    // Don't run if not in gallery mode or if on the extras page
    if (!inGallery || isExtrasPage) return;

    // List of events that indicate user activity
    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click',
    ];

    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });

    // Start initial timer
    resetInactivityTimer();

    // Cleanup
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
    inGallery,
    isWarningActive,
    isExtrasPage,
    handleUserActivity,
    resetInactivityTimer,
  ]);

  // Don't render anything if not in gallery mode or on the extras page
  if (!inGallery || isExtrasPage) {
    return null;
  }

  return (
    <Modal
      isActive={isWarningActive}
      setIsActive={handleCancelRedirect}
      id="gallery-inactivity-warning"
      dataTestId="gallery-inactivity-warning"
      openButtonRef={modalButtonRef}
      showOverlay={true}
    >
      <RedirectModalContent data-component="gallery-inactivity-redirect">
        <RedirectModalTitle>Are you still there?</RedirectModalTitle>
        <p>
          Due to inactivity, you will be redirected to the extras page in{' '}
          <CountdownText>{countdown}</CountdownText> second
          {countdown !== 1 ? 's' : ''}.
        </p>
        <p>Move your mouse or tap the screen to stay on this page.</p>
      </RedirectModalContent>
    </Modal>
  );
};

export default GalleryInactivityRedirect;
