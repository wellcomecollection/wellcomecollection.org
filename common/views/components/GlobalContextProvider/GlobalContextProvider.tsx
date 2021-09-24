import { GetServerSidePropsContext, NextPageContext } from 'next';
import { createContext, FunctionComponent, ReactNode } from 'react';
import GlobalAlertContext, {
  GlobalAlert,
} from '../GlobalAlertContext/GlobalAlertContext';
import PopupDialogContext, {
  PopupDialog,
} from '../PopupDialogContext/PopupDialogContext';
import { ApmContextProvider } from '../ApmContext/ApmContext';
import UserProvider from '../UserProvider/UserProvider';

export type GlobalContextData = {
  globalAlert: GlobalAlert | null;
  popupDialog: PopupDialog | null;
};

type Props = {
  value: GlobalContextData;
  children?: ReactNode;
};

export const defaultValue = {
  globalAlert: null,
  popupDialog: null,
};

export type WithGlobalContextData = {
  globalContextData: GlobalContextData;
};

const Context = createContext<GlobalContextData>(defaultValue);
const GlobalContextProvider: FunctionComponent<Props> = ({
  value,
  children,
}: Props) => {
  return (
    <Context.Provider value={value}>
      <ApmContextProvider>
        <GlobalAlertContext.Provider value={value.globalAlert}>
          <PopupDialogContext.Provider value={value.popupDialog}>
            <UserProvider>{children}</UserProvider>
          </PopupDialogContext.Provider>
        </GlobalAlertContext.Provider>
      </ApmContextProvider>
    </Context.Provider>
  );
};

// FIXME: we need `NextPageContext` as a possible type here for as long as we're using
// `getInitialProps` in the _error page.
export function getGlobalContextData(
  context: GetServerSidePropsContext | NextPageContext
): GlobalContextData {
  return {
    // NextJS types do not yet allow a parametrised `query` :(
    globalAlert: context.query?.globalAlert as unknown as GlobalAlert,
    popupDialog: context.query?.popupDialog as unknown as PopupDialog,
  };
}

export default GlobalContextProvider;
