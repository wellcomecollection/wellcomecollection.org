// @flow

import structuredText from './parts/structured-text';
import text from './parts/text';
import boolean from './parts/boolean';
import link from './parts/link';

const PopupDialog = {
  PopupDialog: {
    openButtonText: text('Open button text'),
    dialogHeading: text('Heading inside the open dialog'),
    dialogCopy: structuredText('Text inside the open dialog', 'single'),
    ctaText: text('CTA inside the open dialog button text'),
    ctaLink: link('CTA inside the open dialog button link', 'web'),
    isShown: boolean('Is shown?', false),
  },
};

export default PopupDialog;
