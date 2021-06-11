import { GetServerSidePropsContext, NextPageContext } from 'next';
import { createContext, FunctionComponent, ReactNode } from 'react';
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
const GlobalContextProvider: FunctionComponent<Props> = ({
  value,
  children,
}: Props) => {
  const parsedOpeningTimes =
    value.openingTimes && parseCollectionVenues(value.openingTimes);
  return (
    <Context.Provider value={value}>
      <OpeningTimesContext.Provider value={parsedOpeningTimes}>
        <GlobalAlertContext.Provider value={value.globalAlert}>
          <PopupDialogContext.Provider value={value.popupDialog}>
            <TogglesContext.Provider value={value.toggles}>
              {value.toggles && value.toggles.helveticaRegular && (
                <style
                  type="text/css"
                  dangerouslySetInnerHTML={{
                    __html: `
                      @font-face {
                        font-family: 'Helvetica Neue Light Web';
                        src: url('https://i.wellcomecollection.org/assets/fonts/helvetica-neue-roman.woff2') format('woff2'),
                          url('https://i.wellcomecollection.org/assets/fonts/helvetica-neue-roman.woff') format('woff');
                        font-weight: normal;
                        font-style: normal;
                      }

                      @font-face {
                        font-family: 'Helvetica Neue Medium Web';
                        src: url('https://i.wellcomecollection.org/assets/fonts/helvetica-neue-bold.woff2') format('woff2'),
                          url('https://i.wellcomecollection.org/assets/fonts/helvetica-neue-bold.woff') format('woff');
                        font-weight: normal;
                        font-style: normal;
                      }
                    `,
                  }}
                />
              )}
              {children}
            </TogglesContext.Provider>
          </PopupDialogContext.Provider>
        </GlobalAlertContext.Provider>
      </OpeningTimesContext.Provider>
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
    toggles: (context.query.toggles as unknown) as Toggles,
    globalAlert: (context.query.globalAlert as unknown) as GlobalAlert,
    popupDialog: (context.query.popupDialog as unknown) as PopupDialog,
    openingTimes: (context.query.openingTimes as unknown) as OpeningTimes,
  };
}

export default GlobalContextProvider;
