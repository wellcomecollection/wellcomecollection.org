import { configure, addDecorator } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import { checkA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs/react';

function loadStories() {
  const stories = require.context('../stories/pages', true, /\.js$/);
  const components = require.context('../stories/components', true, /\.js$/);

  stories.keys().forEach((filename) => stories(filename));
  components.keys().forEach((filename) => components(filename));
}

addDecorator(withKnobs);
addDecorator(checkA11y);

const styles = {
  padding: '30px',
};
const CenterDecorator = (storyFn) => (
  <div style={styles} className='enhanced'>
    { storyFn() }
  </div>
);
addDecorator(CenterDecorator);

setOptions({
  name: 'Cardigan',
  url: 'https://cardigan.wellcomecollection.org',
  addonPanelInRight: true,
});

configure(loadStories, module);
