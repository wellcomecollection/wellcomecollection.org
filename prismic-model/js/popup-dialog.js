// @flow

import structuredText from './parts/structured-text';
import text from './parts/text';
import boolean from './parts/boolean';
import link from './parts/link';

const PopupDialog = {
  PopupDialog: {
    openButtonText: text('Open button text'),
    heading: text('Heading inside the open dialog'),
    text: structuredText('Text inside the open dialog', 'single'),
    linkText: text('CTA inside the open dialog button text'),
    link: link('CTA inside the open dialog button link', 'web'),
    isShown: boolean('Is shown?', false),
  },
};

export default PopupDialog;
