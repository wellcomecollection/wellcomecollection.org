import { GetServerSidePropsContext, NextPageContext } from 'next';
import { createContext, FunctionComponent, ReactNode } from 'react';
import GlobalAlertContext, {
  GlobalAlert,
} from '../GlobalAlertContext/GlobalAlertContext';
import { Toggles } from '@weco/toggles';
import { ApmContextProvider } from '../ApmContext/ApmContext';

export type GlobalContextData = {
  toggles: Toggles;
  globalAlert: GlobalAlert | null;
};

type Props = {
  value: GlobalContextData;
  children?: ReactNode;
};

export const defaultValue = {
  toggles: {} as Toggles,
  globalAlert: null,
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
          {children}
        </GlobalAlertContext.Provider>
      </ApmContextProvider>
    </Context.Provider>
  );
};

// We need NextPageeContext here as we use this method in
// NextPage.getServerSideProps and App.getInitialProps
export function getGlobalContextData(
  context: GetServerSidePropsContext | NextPageContext
): GlobalContextData {
  return {
    // NextJS types do not yet allow a parametrised `query` :(
    toggles: context.query?.toggles as unknown as Toggles,
    globalAlert: context.query?.globalAlert as unknown as GlobalAlert,
  };
}

export default GlobalContextProvider;
