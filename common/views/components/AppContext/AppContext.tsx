import useIsomorphicLayoutEffect from '@weco/common/hooks/useIsomorphicLayoutEffect';
import {
  createContext,
  useState,
  useEffect,
  FunctionComponent,
  PropsWithChildren,
} from 'react';
import { getCookies } from 'cookies-next';
import theme from '@weco/common/views/themes/default';
import { Size } from '@weco/common/views/themes/config';

type AppContextProps = {
  isEnhanced: boolean;
  isFullSupportBrowser: boolean;
  windowSize: Size;
  audioPlaybackRate: number;
  setAudioPlaybackRate: (rate: number) => void;
  hasAcknowledgedCookieBanner: boolean;
  setHasAcknowledgedCookieBanner: (isAcknowledged: boolean) => void;
};

const appContextDefaults = {
  isEnhanced: false,
  isFullSupportBrowser: false,
  windowSize: 'small' as Size,
  audioPlaybackRate: 1,
  setAudioPlaybackRate: () => null,
  hasAcknowledgedCookieBanner: false,
  setHasAcknowledgedCookieBanner: () => null,
};

export const AppContext = createContext<AppContextProps>(appContextDefaults);

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
  const [audioPlaybackRate, setAudioPlaybackRate] = useState(
    appContextDefaults.audioPlaybackRate
  );
  const [hasAcknowledgedCookieBanner, setHasAcknowledgedCookieBanner] =
    useState(Boolean(getCookies().CookieControl));

  useEffect(() => {
    setIsEnhanced(true);
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

  return (
    <AppContext.Provider
      value={{
        isEnhanced,
        isFullSupportBrowser,
        windowSize,
        audioPlaybackRate,
        setAudioPlaybackRate,
        hasAcknowledgedCookieBanner,
        setHasAcknowledgedCookieBanner,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
