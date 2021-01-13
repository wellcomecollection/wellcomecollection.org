import React from 'react';
import { render } from 'react-dom';
import { Registration } from './Registration/Registration';
import { AccountValidated } from './Registration/AccountValidated';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { AppContextProvider } from '@weco/common/views/components/AppContext/AppContext';
import { ThemeProvider } from 'styled-components';
import theme from '@weco/common/views/themes/default';
import styled from 'styled-components';

import '@weco/common/styles/styleguide.scss';

const root = typeof document !== 'undefined' ? document.getElementById('root') : undefined;

const Wrapper = styled.div`
   {
    width: 70%;
    margin: auto;
    background-color: #f0ede3;
    padding: 42px;
  }
`;

if (root) {
  render(
    <ThemeProvider theme={theme}>
      <Wrapper>
        <style id="styleguide-sass"></style>
        <AppContextProvider>
          <BrowserRouter>
            <Switch>
              <Route exact path="/register" component={Registration} />
              <Route exact path="/validated" component={AccountValidated} />
            </Switch>
          </BrowserRouter>
        </AppContextProvider>
      </Wrapper>
    </ThemeProvider>,
    root
  );
} else {
  console.warn('Could not mount application, #root not found');
}
