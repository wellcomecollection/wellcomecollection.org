import { createContext, FunctionComponent, useState } from 'react';

type ContextProps = {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
};
const GlobalInfoBarContext = createContext<ContextProps>({
  isVisible: false,
  setIsVisible: () => {
    // noop
  },
});
const GlobalInfoBarContextProvider: FunctionComponent = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <GlobalInfoBarContext.Provider
      value={{
        isVisible,
        setIsVisible,
      }}
    >
      {children}
    </GlobalInfoBarContext.Provider>
  );
};

export default GlobalInfoBarContext;
export { GlobalInfoBarContextProvider };
