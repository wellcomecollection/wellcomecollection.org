import { createContext, FunctionComponent, ReactNode, useState } from 'react';

type Props = {
  children: ReactNode;
};
type ContextProps = {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
};
const GlobalInfoBarContext = createContext<ContextProps | undefined>(undefined);
const GlobalInfoBarContextProvider: FunctionComponent<Props> = ({
  children,
}: Props) => {
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
