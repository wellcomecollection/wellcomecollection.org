import { ReactNode, FunctionComponent } from 'react';
import { ThemeProvider } from 'styled-components';
import theme, { GlobalStyle } from '@weco/common/views/themes/default';
import { AppContextProvider } from '@weco/common/views/components/AppContext/AppContext';

type Props = {
  children: ReactNode;
};
export const ContextDecorator: FunctionComponent<Props> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle isFontsLoaded={true} />
      <AppContextProvider>
        <div className="enhanced">{children}</div>
      </AppContextProvider>
    </ThemeProvider>
  );
};
