import React from 'react';
import { render } from 'react-dom';
import { Registration } from './Registration/Registration';
import { AccountValidated } from './Registration/AccountValidated';
import { AccountManagement } from './AccountManagement/AccountManagement';
import { ErrorPage } from './Shared/ErrorPage';

import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { AppContextProvider } from '@weco/common/views/components/AppContext/AppContext';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import theme from '@weco/common/views/themes/default';
import '@weco/common/styles/styleguide.scss';
import { initaliseMiddlewareClient } from '../utility/middleware-api-client';

const GlobalStyles = createGlobalStyle`
  body {
    background-color: #f0ede3;
  }
`;

const root = typeof document !== 'undefined' ? document.getElementById('root') : undefined;

if (root) {
  const prefix = root.getAttribute('data-context-path');
  initaliseMiddlewareClient(prefix);
  render(
    <ThemeProvider theme={theme}>
      <style id="styleguide-sass"></style>
      <AppContextProvider>
        <GlobalStyles />
        <BrowserRouter basename={prefix}>
          <Switch>
            <Route exact path="/register" component={Registration} />
            <Route exact path="/validated" component={AccountValidated} />
            <Route exact path="/error" component={ErrorPage} />
            <Route exact path="/" component={AccountManagement} />
          </Switch>
        </BrowserRouter>
      </AppContextProvider>
    </ThemeProvider>,
    root
  );
} else {
  console.warn('Could not mount application, #root not found');
}
