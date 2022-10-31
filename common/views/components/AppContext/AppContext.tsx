import useIsomorphicLayoutEffect from '@weco/common/hooks/useIsomorphicLayoutEffect';
import {
  createContext,
  useState,
  useEffect,
  ReactElement,
  FunctionComponent,
  ReactNode,
} from 'react';
import theme from '@weco/common/views/themes/default';
import { Size } from '@weco/common/views/themes/config';

type AppContextProps = {
  isEnhanced: boolean;
  isKeyboard: boolean;
  isFullSupportBrowser: boolean;
  windowSize: Size;
  audioPlaybackRate: number;
  setAudioPlaybackRate: (rate: number) => void;
};

const appContextDefaults = {
  isEnhanced: false,
  isKeyboard: true,
  isFullSupportBrowser: false,
  windowSize: 'small' as Size,
  audioPlaybackRate: 1,
  setAudioPlaybackRate: () => null,
};

export const AppContext = createContext<AppContextProps>(appContextDefaults);

type AppContextProviderProps = {
  children: ReactNode;
};

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

export const AppContextProvider: FunctionComponent<AppContextProviderProps> = ({
  children,
}: AppContextProviderProps): ReactElement<AppContextProviderProps> => {
  const [isEnhanced, setIsEnhanced] = useState(appContextDefaults.isEnhanced);
  const [isKeyboard, setIsKeyboard] = useState(appContextDefaults.isKeyboard);
  const [isFullSupportBrowser, setIsFullSupportBrowser] = useState(
    appContextDefaults.isFullSupportBrowser
  );
  const [windowSize, setWindowSize] = useState<Size>(
    appContextDefaults.windowSize
  );
  const [audioPlaybackRate, setAudioPlaybackRate] = useState(
    appContextDefaults.audioPlaybackRate
  );

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

    document.addEventListener('mousedown', setIsKeyboardFalse);
    document.addEventListener('keydown', setIsKeyboardTrue);

    return () => {
      document.removeEventListener('mousedown', setIsKeyboardFalse);
      document.removeEventListener('keydown', setIsKeyboardTrue);
    };
  }, []);

  function setIsKeyboardFalse() {
    document &&
      document.documentElement &&
      document.documentElement.classList.remove('is-keyboard');
    setIsKeyboard(false);
  }

  function setIsKeyboardTrue() {
    document &&
      document.documentElement &&
      document.documentElement.classList.add('is-keyboard');
    setIsKeyboard(true);
  }

  return (
    <AppContext.Provider
      value={{
        isEnhanced,
        isKeyboard,
        isFullSupportBrowser,
        windowSize,
        audioPlaybackRate,
        setAudioPlaybackRate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
