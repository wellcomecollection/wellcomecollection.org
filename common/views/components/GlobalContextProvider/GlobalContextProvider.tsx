import { GetServerSidePropsContext, NextPageContext } from 'next';
import { createContext, FC, ReactNode } from 'react';
import OpeningTimesContext, {
  OpeningTimes,
} from '../OpeningTimesContext/OpeningTimesContext';
import GlobalAlertContext, {
  GlobalAlert,
} from '../GlobalAlertContext/GlobalAlertContext';
import PopupDialogContext, {
  PopupDialog,
} from '../PopupDialogContext/PopupDialogContext';
import TogglesContext from '../TogglesContext/TogglesContext';
import { parseCollectionVenues } from '../../../services/prismic/opening-times';
import { Toggles } from '@weco/toggles';
import { ApmContextProvider } from '../ApmContext/ApmContext';
import UserProvider from '../UserProvider/UserProvider';

export type GlobalContextData = {
  toggles: Toggles;
  globalAlert: GlobalAlert | null;
  popupDialog: PopupDialog | null;
  openingTimes: OpeningTimes | null;
};

type Props = {
  value: GlobalContextData;
  children?: ReactNode;
};

export const defaultValue = {
  toggles: {} as Toggles,
  globalAlert: null,
  popupDialog: null,
  openingTimes: null,
};

export type WithGlobalContextData = {
  globalContextData: GlobalContextData;
};

const Context = createContext<GlobalContextData>(defaultValue);
const GlobalContextProvider: FC<Props> = ({
  value,
  children,
}: Props) => {
  const parsedOpeningTimes =
    value.openingTimes && parseCollectionVenues(value.openingTimes);

  return (
    <Context.Provider value={value}>
      <ApmContextProvider>
        <OpeningTimesContext.Provider value={parsedOpeningTimes}>
          <GlobalAlertContext.Provider value={value.globalAlert}>
            <PopupDialogContext.Provider value={value.popupDialog}>
              <TogglesContext.Provider value={value.toggles}>
                <UserProvider>{children}</UserProvider>
              </TogglesContext.Provider>
            </PopupDialogContext.Provider>
          </GlobalAlertContext.Provider>
        </OpeningTimesContext.Provider>
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
    popupDialog: context.query?.popupDialog as unknown as PopupDialog,
    openingTimes: context.query?.openingTimes as unknown as OpeningTimes,
  };
}

export default GlobalContextProvider;
