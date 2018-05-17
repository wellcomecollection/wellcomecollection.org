import { configure, addDecorator } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';

function loadStories() {
  require('../stories/PageHeaders');
  require('../stories/index.js');
}

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
