import { singleLineText } from './parts/structured-text';
import text from './parts/text';
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
      openButtonText: text('Open button text'),
      title: text('Title inside the open dialog'),
      text: singleLineText('Text inside the open dialog'),
      linkText: text('CTA inside the open dialog button text'),
      link: webLink('CTA inside the open dialog button link'),
      isShown: boolean('Is shown?', { defaultValue: false }),
    },
  },
};

export default popupDialog;
