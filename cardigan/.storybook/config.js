import { default as React, Fragment } from 'react';
import { configure, addDecorator } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import { checkA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs/react';
import styleguideSass from '../../common/styles/styleguide.scss';
import { ThemeProvider } from 'styled-components';
import theme from '../../common/views/themes/default';
import { addReadme } from 'storybook-readme';

function loadStories() {
  const components = require.context('../stories/components', true, /\.js$/);
  const global = require.context('../stories/global', true, /\.js$/);
  const docs = require.context('../stories/docs', true, /\.js$/);

  components.keys().forEach((filename) => components(filename));
  global.keys().forEach((filename) => global(filename));
  docs.keys().forEach((filename) => docs(filename));
}

addDecorator(addReadme);
addDecorator(withKnobs);
addDecorator(checkA11y);

const CenterDecorator = (storyFn) => {
  const story = storyFn();

  const styles = {
    padding: '0px 30px',
  }

  return (
    <ThemeProvider theme={theme}>
      <>
        <style id='styleguide-sass'>
          {styleguideSass}
        </style>
        <div style={styles} className='enhanced'>
          { story }
        </div>
      </>
    </ThemeProvider>
  )
};
addDecorator(CenterDecorator);

setOptions({
  name: 'Cardigan',
  url: 'https://cardigan.wellcomecollection.org',
  addonPanelInRight: false,
  hierarchySeparator: /\//,
  sortStoriesByKind: true
});

configure(loadStories, module);
