import { CustomType } from './types/CustomType';
import title from './parts/title';
import link from './parts/link';
import image from './parts/image';
import structuredText from './parts/structured-text';
import embed from './parts/embed';
import contributorsWithTitle from './parts/contributorsWithTitle';
import number from './parts/number';
import list from './parts/list';

const commonContentFields = {
  number: number('Position number'),
  title,
  creator: contributorsWithTitle(),
  image: image('image'),
  description: structuredText('Description', 'single'),
  'audio-with-description': link('Audio', 'media', []),
  'audio-without-description': link('Audio', 'media', []),
  'bsl-video': embed('Embed (Youtube)'),
  caption: structuredText('Caption', 'single'),
  transcript: structuredText('Transcript', 'single'),
};

const digitalGuidesStop: CustomType = {
  id: 'digital-guides-stop',
  label: 'Digital Guide Stop',
  repeatable: true,
  status: true,
  json: {
    Stop: {
      title,
      'related-content': link('Related document, e.g. Exhibition', 'document', [
        'exhibitions',
      ]),
      ...commonContentFields,
    },
    'Content relationships': {
      parents: list('Parents', {
        order: number('Order'),
        parent: link(
          'Parent',
          'document',
          ['digital-guide'],
          'Select a parent'
        ),
      }),
    },
  },
};

export default digitalGuidesStop;
