import { ReactNode, FunctionComponent } from 'react';
import styleguideSass from '@weco/common/styles/styleguide.scss';
import { ThemeProvider } from 'styled-components';
import theme, { GlobalStyle } from '../../common/views/themes/default';
import { AppContextProvider } from '../../common/views/components/AppContext/AppContext';

type Props = {
  children: ReactNode;
};
export const ContextDecorator: FunctionComponent<Props> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContextProvider>
        <style id="styleguide-sass">{styleguideSass}</style>
        <div className="enhanced">{children}</div>
      </AppContextProvider>
    </ThemeProvider>
  );
};
