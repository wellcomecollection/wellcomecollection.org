import {
  createContext,
  useState,
  useEffect,
  ReactElement,
  FunctionComponent,
  ReactNode,
} from 'react';

type AppContextProps = {
  isEnhanced: boolean;
  isKeyboard: boolean;
  isFullSupportBrowser: boolean;
};

const appContextDefaults = {
  isEnhanced: false,
  isKeyboard: true,
  isFullSupportBrowser: false,
};

export const AppContext = createContext<AppContextProps>(appContextDefaults);

type AppContextProviderProps = {
  children: ReactNode;
};

export const AppContextProvider: FunctionComponent<AppContextProviderProps> = ({
  children,
}: AppContextProviderProps): ReactElement<AppContextProviderProps> => {
  const [isEnhanced, setIsEnhanced] = useState(appContextDefaults.isEnhanced);
  const [isKeyboard, setIsKeyboard] = useState(appContextDefaults.isKeyboard);
  const [isFullSupportBrowser, setIsFullSupportBrowser] = useState(
    appContextDefaults.isFullSupportBrowser
  );

  useEffect(() => {
    setIsEnhanced(true);
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
      value={{ isEnhanced, isKeyboard, isFullSupportBrowser }}
    >
      {children}
    </AppContext.Provider>
  );
};
