import { multiLineText } from './parts/text';
import select from './parts/select';
import keyword from './parts/keyword';
import { CustomType } from './types/CustomType';

const globalAlert: CustomType = {
  id: 'global-alert',
  label: 'Global alert',
  repeatable: false,
  status: true,
  json: {
    'Global alert': {
      text: multiLineText('text', {
        extraTextOptions: ['heading2'],
        placeholder: 'text',
      }),
      isShown: select('Display', {
        options: ['hide', 'show'],
        defaultValue: 'hide',
        placeholder: 'Show or hide',
      }),
      routeRegex: keyword(
        'Write a pipe-separated (|) list of page paths here if you only want the alert to display on certain pages. Leave empty if you want the alert to appear on all pages.',
        { placeholder: 'path(s) to match' }
      ),
    },
  },
  format: 'custom',
};

export default globalAlert;
