import { AppProps } from 'next/app';
import React, { useEffect, FunctionComponent, ReactElement } from 'react';
import { ThemeProvider } from 'styled-components';
import theme, { GlobalStyle } from '../../views/themes/default';
import { AppContextProvider } from '../components/AppContext/AppContext';
import { Pageview } from '../../services/conversion/track';
import useIsFontsLoaded from '../../hooks/useIsFontsLoaded';
import {
  isServerData,
  defaultServerData,
  ServerData,
} from '../../server-data/types';
import { ServerDataContext } from '../../server-data/Context';
import { ApmContextProvider } from '../components/ApmContext/ApmContext';
import { AppErrorProps } from '../../services/app';
import { NextPage } from 'next';

export type NextPageWithLayout<P = unknown, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactElement;
};

type GlobalProps = {
  serverData: ServerData;
  pageview?: Pageview;
} & Partial<AppErrorProps>;

type WecoAppProps = Omit<AppProps, 'pageProps'> & {
  pageProps: GlobalProps;
  Component: NextPageWithLayout;
};

const WecoApp: FunctionComponent<WecoAppProps> = ({ pageProps, Component }) => {
  // You can set `skipServerData: true` to explicitly bypass this
  // e.g. for error pages
  const isServerDataSet = isServerData(pageProps.serverData);

  const serverData = isServerDataSet ? pageProps.serverData : defaultServerData;

  useEffect(() => {
    document.documentElement.classList.add('enhanced');
  }, []);

  const getLayout = Component.getLayout || (page => <>{page}</>);

  return (
    <>
      <ApmContextProvider>
        <ServerDataContext.Provider value={serverData}>
          <AppContextProvider>
            <ThemeProvider theme={theme}>
              <GlobalStyle
                toggles={serverData.toggles}
                isFontsLoaded={useIsFontsLoaded()}
              />
              {!pageProps.err &&
                getLayout(<Component {...(pageProps as any)} />)}
            </ThemeProvider>
          </AppContextProvider>
        </ServerDataContext.Provider>
      </ApmContextProvider>
    </>
  );
};

export default WecoApp;
