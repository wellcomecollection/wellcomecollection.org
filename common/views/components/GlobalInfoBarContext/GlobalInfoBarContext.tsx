import { createContext, FunctionComponent, ReactNode, useState } from 'react';

type Props = {
  children: ReactNode;
};

const GlobalInfoBarContext = createContext<
  | {
      isVisible: boolean;
      setIsVisible: (isVisible: boolean) => void;
    }
  | undefined
>(undefined);
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
