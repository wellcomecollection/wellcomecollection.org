import title from './parts/title';
import promo from './parts/promo';
import { body } from './parts/bodies';
import contributorsWithTitle from './parts/contributorsWithTitle';
import { documentLink } from './parts/link';
import { singleLineText } from './parts/text';
import { CustomType } from './types/CustomType';

const eventSeries: CustomType = {
  id: 'event-series',
  label: 'Event series',
  repeatable: true,
  status: true,
  json: {
    'Event series': {
      title,
      backgroundTexture: documentLink('Background texture', {
        linkedType: 'background-textures',
      }),
      body,
    },
    Contributors: contributorsWithTitle(),
    Promo: {
      promo,
    },
    Metadata: {
      metadataDescription: singleLineText('Metadata description'),
    },
  },
  format: 'custom',
};

export default eventSeries;
