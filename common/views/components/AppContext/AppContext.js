// @flow
import { createContext, useState, useEffect, type Node } from 'react';
type AppContextProps = {|
  isEnhanced: boolean,
  isKeyboard: boolean,
|};

const appContextDefaults = {
  isEnhanced: false,
  isKeyboard: true,
};

export const AppContext = createContext<AppContextProps>(appContextDefaults);

type AppContextProviderProps = {|
  children: Node,
|};

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [isEnhanced, setIsEnhanced] = useState(appContextDefaults.isEnhanced);
  const [isKeyboard, setIsKeyboard] = useState(appContextDefaults.isKeyboard);

  useEffect(() => {
    setIsEnhanced(true);

    document.addEventListener('mousedown', setIsKeyboardFalse);
    document.addEventListener('keydown', setIsKeyboardTrue);

    return () => {
      document.removeEventListener('mousedown', setIsKeyboardFalse);
      document.removeEventListener('keydown', setIsKeyboardTrue);
    };
  }, []);

  function setIsKeyboardFalse() {
    setIsKeyboard(false);
  }

  function setIsKeyboardTrue() {
    setIsKeyboard(true);
  }

  return (
    <AppContext.Provider value={{ isEnhanced, isKeyboard }}>
      {children}
    </AppContext.Provider>
  );
};
