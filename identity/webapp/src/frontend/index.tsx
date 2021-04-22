import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { AppContextProvider } from '@weco/common/views/components/AppContext/AppContext';
import theme from '@weco/common/views/themes/default';
import '@weco/common/styles/styleguide.scss';
import { initaliseMiddlewareClient } from '../utility/middleware-api-client';
import { Registration } from './Registration/Registration';
import { AccountValidated } from './Registration/AccountValidated';
import { ErrorPage } from './components/ErrorPage';
import { MyAccount } from './MyAccount/MyAccount';
import { DeleteRequested } from './MyAccount/DeleteRequested';

const GlobalStyles = createGlobalStyle`
  body {
    background-color: #fff;

    @media screen and (min-width: 600px) {
      background-color: #f0ede3;
    }
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
        <BrowserRouter basename={prefix || ''} forceRefresh>
          <Switch>
            <Route exact path="/register" component={Registration} />
            <Route exact path="/validated" component={AccountValidated} />
            <Route exact path="/delete-requested" component={DeleteRequested} />
            <Route exact path="/error" component={ErrorPage} />
            <Route exact path="/" component={MyAccount} />
          </Switch>
        </BrowserRouter>
      </AppContextProvider>
    </ThemeProvider>,
    root
  );
} else {
  console.warn('Could not mount application, #root not found');
}
