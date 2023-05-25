import { singleLineText } from './parts/text';
import keyword from './parts/keyword';
import boolean from './parts/boolean';
import { webLink } from './parts/link';
import { CustomType } from './types/CustomType';

const popupDialog: CustomType = {
  id: 'popup-dialog',
  label: 'Popup dialog',
  repeatable: false,
  status: true,
  json: {
    'Popup dialog': {
      openButtonText: keyword('Open button text'),
      title: keyword('Title inside the open dialog'),
      text: singleLineText('Text inside the open dialog'),
      linkText: keyword('CTA inside the open dialog button text'),
      link: webLink('CTA inside the open dialog button link'),
      isShown: boolean('Is shown?', { defaultValue: false }),
    },
  },
  format: 'custom',
};

export default popupDialog;
