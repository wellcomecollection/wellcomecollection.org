import React from 'react';
import { addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { AppContextProvider } from '@weco/common/views/components/AppContext/AppContext';
import { ThemeProvider } from 'styled-components';
import theme, { GlobalStyle } from '@weco/common/views/themes/default';

addDecorator(withKnobs);

const CenterDecorator = (storyFn, { parameters }) => {
  const story = storyFn();

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContextProvider>{story}</AppContextProvider>
    </ThemeProvider>
  );
};

addDecorator(CenterDecorator);

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};
