import { configure, addDecorator } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import { checkA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs/react';

function loadStories() {
  require('../stories/index.js');
  require('../stories/Links.js');
}

addDecorator(withKnobs);
addDecorator(checkA11y);

setOptions({
  name: 'Cardigan',
  url: 'https://cardigan.wellcomecollection.org',
  addonPanelInRight: true,
});

configure(loadStories, module);
