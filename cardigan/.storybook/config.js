import { default as React, Fragment } from 'react';
import { configure, addDecorator } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import { checkA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs/react';
import { withInfo } from '@storybook/addon-info';
import { themes } from '@storybook/components';
import { wecoTheme } from './weco-theme';
import styleguideSass from '../../common/styles/styleguide.scss';

function loadStories() {
  const components = require.context('../stories/components', true, /\.js$/);
  const global = require.context('../stories/global', true, /\.js$/);
  const docs = require.context('../stories/docs', true, /\.js$/);
  const wip = require.context('../stories/wip', true, /\.js$/);

  components.keys().forEach((filename) => components(filename));
  global.keys().forEach((filename) => global(filename));
  docs.keys().forEach((filename) => docs(filename));
  wip.keys().forEach((filename) => wip(filename));
}

addDecorator(withKnobs);
addDecorator(checkA11y);
addDecorator(withInfo({
  header: false,
  inline: true,
  source: false,
  propTables: false
}));

const styles = {
  padding: '30px',
};
const CenterDecorator = (storyFn) => (
  <Fragment>
    <style id='styleguide-sass'>
      {styleguideSass}
    </style>
    <div style={styles} className='enhanced'>
      { storyFn() }
    </div>
  </Fragment>
);
addDecorator(CenterDecorator);

setOptions({
  name: 'Cardigan',
  url: 'https://cardigan.wellcomecollection.org',
  addonPanelInRight: true,
  hierarchySeparator: /\//,
  sortStoriesByKind: true,
  theme: {
    ...themes.normal,
    wecoTheme
  }
});

configure(loadStories, module);
