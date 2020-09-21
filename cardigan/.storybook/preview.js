import { default as React, Fragment } from 'react';
import { configure, addDecorator, addParameters } from '@storybook/react';
import { checkA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs/react';
import styleguideSass from '../../common/styles/styleguide.scss';
import { ThemeProvider } from 'styled-components';
import theme from '../../common/views/themes/default';
import { addReadme } from 'storybook-readme';
import { AppContextProvider } from '../../common/views/components/AppContext/AppContext';

addParameters({
  options: {
    name: 'Cardigan',
    url: 'https://cardigan.wellcomecollection.org',
    theme: {}
  },
});
addDecorator(addReadme);
addDecorator(withKnobs);
addDecorator(checkA11y);

const CenterDecorator = storyFn => {
  const story = storyFn();

  const styles = {
    padding: '0px 30px',
  };

  return (
    <ThemeProvider theme={theme}>
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
