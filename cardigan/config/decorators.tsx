import { FunctionComponent } from 'react';
import { ThemeProvider } from 'styled-components';
import theme, { GlobalStyle } from '@weco/common/views/themes/default';
import { AppContextProvider } from '@weco/common/views/components/AppContext/AppContext';
import useIsFontsLoaded from '@weco/common/hooks/useIsFontsLoaded';

export const ContextDecorator: FunctionComponent = ({ children }) => (
  <ThemeProvider theme={theme}>
    <GlobalStyle isFontsLoaded={useIsFontsLoaded()} />
    <AppContextProvider>
      <div className="enhanced">{children}</div>
    </AppContextProvider>
  </ThemeProvider>
);
