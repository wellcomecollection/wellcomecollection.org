import { CustomType } from './types/CustomType';
import link from './parts/link';

const featuredSerial: CustomType = {
  id: 'featured-serial',
  label: 'Featured serial',
  repeatable: false,
  status: true,
  json: {
    'Featured serial': {
      serial: link(
        'Serial',
        'document',
        ['series'],
        'Select a serial to display on the Stories landing page'
      ),
    },
  },
};

export default featuredSerial;
