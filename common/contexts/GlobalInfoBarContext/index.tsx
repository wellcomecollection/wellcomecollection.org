import {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useContext,
  useState,
} from 'react';

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

function useGlobalInfoBarContext(): ContextProps {
  const contextState = useContext(GlobalInfoBarContext);
  return contextState;
}

const GlobalInfoBarContextProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
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
export { GlobalInfoBarContextProvider, useGlobalInfoBarContext };
