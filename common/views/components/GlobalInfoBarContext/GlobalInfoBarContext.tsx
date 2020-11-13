import {
  createContext,
  ReactNode,
  FunctionComponent,
  useState,
  ReactElement,
} from 'react';
const GlobalInfoBarContext = createContext(null);

type Props = {
  value: boolean;
  children: ReactNode;
};

export const GlobalInfoBarProvider: FunctionComponent<Props> = ({
  value = false,
  children,
}: Props): ReactElement => {
  const setInfoBarItem = (condition: boolean) => {
    setInfoBar({
      showInfoBarBanner: condition,
      setInfoBarBanner: setInfoBarItem,
    });
  };

  const [infoBar, setInfoBar] = useState({
    showInfoBarBanner: value,
    setInfoBarBanner: setInfoBarItem,
  });

  return (
    <GlobalInfoBarContext.Provider value={infoBar}>
      {children}
    </GlobalInfoBarContext.Provider>
  );
};

export default GlobalInfoBarContext;
