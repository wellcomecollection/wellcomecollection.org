// @flow
import { createContext, useState, useEffect, type Node } from 'react';
// $FlowFixMe
export const AppContext = createContext();

type Props = {|
  children: Node,
|};

export const AppContextProvider = ({ children }: Props) => {
  const [isEnhanced, setIsEnhanced] = useState(false);
  const [isKeyboard, setIsKeyboard] = useState(true);

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
