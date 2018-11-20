import { default as React, Fragment } from 'react';
import { configure, addDecorator } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import { checkA11y } from '@storybook/addon-a11y';
import { withKnobs, select } from '@storybook/addon-knobs/react';
import { withInfo } from '@storybook/addon-info';
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
const PageDecorator = storyFn => {
  const width = select('Width', ['25%', '50%', '75%', '100%'], '100%');

  return (
    <div style={{width}}>
      <style id='styleguide-sass'>
        {styleguideSass}
      </style>
      <div style={styles} className='enhanced'>
        { storyFn() }
      </div>
    </div>
  );
};

addDecorator(PageDecorator);

setOptions({
  name: 'Cardigan',
  url: 'https://cardigan.wellcomecollection.org',
  addonPanelInRight: true,
  hierarchySeparator: /\//,
  sortStoriesByKind: true
});

configure(loadStories, module);
