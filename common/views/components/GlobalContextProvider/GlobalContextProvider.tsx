import { GetServerSidePropsContext, NextPageContext } from 'next';
import { createContext, FunctionComponent, ReactNode } from 'react';
import { Query } from '@prismicio/types';
import OpeningTimesContext from '../OpeningTimesContext/OpeningTimesContext';
import GlobalAlertContext, {
  GlobalAlert,
} from '../GlobalAlertContext/GlobalAlertContext';
import PopupDialogContext, {
  PopupDialog,
} from '../PopupDialogContext/PopupDialogContext';
import { parseCollectionVenues } from '../../../services/prismic/opening-times';
import { Toggles } from '@weco/toggles';
import { ApmContextProvider } from '../ApmContext/ApmContext';
import {
  CollectionVenuePrismicDocument,
  emptyPrismicQuery,
} from '../../../services/prismic/types';

export type GlobalContextData = {
  toggles: Toggles;
  openingTimes: Query<CollectionVenuePrismicDocument>;
  globalAlert: GlobalAlert | null;
  popupDialog: PopupDialog | null;
};

type Props = {
  value: GlobalContextData;
  children?: ReactNode;
};

export const defaultValue = {
  toggles: {} as Toggles,
  openingTimes: emptyPrismicQuery<CollectionVenuePrismicDocument>(),
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
  const parsedOpeningTimes = parseCollectionVenues(value.openingTimes);

  return (
    <Context.Provider value={value}>
      <ApmContextProvider>
        <OpeningTimesContext.Provider value={parsedOpeningTimes}>
          <GlobalAlertContext.Provider value={value.globalAlert}>
            <PopupDialogContext.Provider value={value.popupDialog}>
              {children}
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
    openingTimes: context.query
      ?.openingTimes as unknown as Query<CollectionVenuePrismicDocument>,
  };
}

export default GlobalContextProvider;
