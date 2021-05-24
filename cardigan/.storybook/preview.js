import { default as React, Fragment } from 'react';
import { configure, addDecorator, addParameters } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import styleguideSass from '../../common/styles/styleguide.scss';
import { ThemeProvider } from 'styled-components';
import theme, { GlobalStyle } from '../../common/views/themes/default';
import { addReadme } from 'storybook-readme';
import { AppContextProvider } from '../../common/views/components/AppContext/AppContext';

addParameters({
  options: {
    name: 'Cardigan',
    url: 'https://cardigan.wellcomecollection.org',
    theme: {},
  },
});
addDecorator(addReadme);
addDecorator(withKnobs);

const CenterDecorator = (storyFn, { parameters }) => {
  const story = storyFn();

  const styles = {
    padding: parameters.isFullScreen ? 0 : '30px',
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContextProvider>
        <style id="styleguide-sass">{styleguideSass}</style>
        <div style={styles} className="enhanced">
          {story}
        </div>
      </AppContextProvider>
    </ThemeProvider>
  );
};
addDecorator(CenterDecorator);
