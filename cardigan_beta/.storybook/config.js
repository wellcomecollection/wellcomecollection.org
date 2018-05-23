import { configure, addDecorator } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import { checkA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs/react';

function loadStories() {
  require('../stories/Base');
  require('../stories/Body');
  require('../stories/Links.js');
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
