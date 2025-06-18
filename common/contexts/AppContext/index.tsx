import { getCookies } from 'cookies-next';
import {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

import useIsomorphicLayoutEffect from '@weco/common/hooks/useIsomorphicLayoutEffect';
import {
  ACTIVE_COOKIE_BANNER_ID,
  COOKIE_BANNER_PARENT_ID,
} from '@weco/common/services/app/civic-uk';
import { Size } from '@weco/common/views/themes/config';
import theme from '@weco/common/views/themes/default';

type AppContextProps = {
  isEnhanced: boolean;
  isFullSupportBrowser: boolean;
  windowSize: Size;
  activeAudioPlayerId: string | null;
  setActiveAudioPlayerId: (id: string) => void;
  audioPlaybackRate: number;
  setAudioPlaybackRate: (rate: number) => void;
  hasAcknowledgedCookieBanner: boolean;
  setHasAcknowledgedCookieBanner: (isAcknowledged: boolean) => void;
  isMobileOrTabletDevice: boolean;
};

const appContextDefaults = {
  isEnhanced: false,
  isFullSupportBrowser: false,
  windowSize: 'small' as Size,
  activeAudioPlayerId: null,
  setActiveAudioPlayerId: () => null,
  audioPlaybackRate: 1,
  setAudioPlaybackRate: () => null,
  hasAcknowledgedCookieBanner: false,
  setHasAcknowledgedCookieBanner: () => null,
  isMobileOrTabletDevice: true,
};

const AppContext = createContext<AppContextProps>(appContextDefaults);

export function useAppContext(): AppContextProps {
  const contextState = useContext(AppContext);
  return contextState;
}

function checkForMobileOrTabletDevice(): boolean {
  return (
    /Mobi|Android|iPad|iPhone|iPod|tablet|Tablet|Silk|Kindle|BlackBerry|PlayBook|KFAPWI|(Android.+Mobile)/i.test(
      navigator.userAgent
    ) ||
    // Alternative approach to detect iPad with iOS 13+ that disguises as desktop
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

function getWindowSize(): Size {
  switch (true) {
    case window.innerWidth < theme.sizes.medium:
      return 'small';
    case window.innerWidth < theme.sizes.large:
      return 'medium';
    case window.innerWidth < theme.sizes.xlarge:
      return 'large';
    default:
      return 'xlarge';
  }
}

export const AppContextProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [isEnhanced, setIsEnhanced] = useState(appContextDefaults.isEnhanced);
  const [isFullSupportBrowser, setIsFullSupportBrowser] = useState(
    appContextDefaults.isFullSupportBrowser
  );
  const [windowSize, setWindowSize] = useState<Size>(
    appContextDefaults.windowSize
  );
  const [activeAudioPlayerId, setActiveAudioPlayerId] = useState<string | null>(
    null
  );
  const [audioPlaybackRate, setAudioPlaybackRate] = useState(
    appContextDefaults.audioPlaybackRate
  );
  const [hasAcknowledgedCookieBanner, setHasAcknowledgedCookieBanner] =
    useState(Boolean(getCookies().CookieControl));
  const [isMobileOrTabletDevice, setisMobileOrTabletDevice] = useState(
    appContextDefaults.isMobileOrTabletDevice
  );

  useEffect(() => {
    setIsEnhanced(true);
    setisMobileOrTabletDevice(checkForMobileOrTabletDevice());
  }, []);

  // We need the initial state to be set before rendering to avoid
  // flashing of content, so use `useLayoutEffect` for the initial
  // setting of `windowSize`
  function updateWindowSize() {
    setWindowSize(getWindowSize());
  }

  useEffect(() => {
    window.addEventListener('resize', updateWindowSize);
    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  useIsomorphicLayoutEffect(() => {
    updateWindowSize();
  }, []);

  useEffect(() => {
    // The presence of IntersectionObserver is a useful proxy for browsers that we
    // want to support in full: https://caniuse.com/intersectionobserver
    setIsFullSupportBrowser('IntersectionObserver' in window);
  }, []);

  useEffect(() => {
    // If CookieControl has not been set yet;
    if (!hasAcknowledgedCookieBanner) {
      // If banner or popup is actively displaying
      if (document.getElementById(ACTIVE_COOKIE_BANNER_ID)) {
        // Only once has the overlay gone from the DOM can we consider the cookie banner acknowledged
        // The parent element is always in the DOM, but if it has no children then it's inactive.
        const callback = mutationList => {
          for (const mutation of mutationList) {
            if (mutation.type === 'childList') {
              setHasAcknowledgedCookieBanner(
                document.getElementById(COOKIE_BANNER_PARENT_ID)
                  ?.childElementCount === 0
              );
            }
          }
        };
        const observer = new MutationObserver(callback);
        observer.observe(document.body, { childList: true, subtree: true });
        return () => observer.disconnect();
      } else if (!document.getElementById(COOKIE_BANNER_PARENT_ID)) {
        // If the CivicUK script failed to load for any reason, we should consider it acknowledged by default.
        // We need this for our tests and Cardigan as well.
        setHasAcknowledgedCookieBanner(true);
      }
    }
  }, [hasAcknowledgedCookieBanner]);

  return (
    <AppContext.Provider
      value={{
        isEnhanced,
        isFullSupportBrowser,
        windowSize,
        activeAudioPlayerId,
        setActiveAudioPlayerId,
        audioPlaybackRate,
        setAudioPlaybackRate,
        hasAcknowledgedCookieBanner,
        setHasAcknowledgedCookieBanner,
        isMobileOrTabletDevice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
