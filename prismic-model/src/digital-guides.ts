import { CustomType } from './types/CustomType';
import title from './parts/title';
import link from './parts/link';
import list from './parts/list';
import image from './parts/image';
import structuredText from './parts/structured-text';
import embed from './parts/embed';
import contributorsWithTitle from './parts/contributorsWithTitle';
import number from './parts/number';
import boolean from './parts/boolean';

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
  section: boolean('Section'),
  subSection: boolean('Sub-section'),
  stop: boolean('Stop'),
};

const digitalGuides: CustomType = {
  id: 'digital-guides',
  label: 'Digital Guide',
  repeatable: true,
  status: true,
  json: {
    Guide: {
      title,
      'related-content': link('Related document, e.g. Exhibition', 'document', [
        'exhibitions',
      ]),
    },
    // We are providing a repeatable list of guide components which could be:
    // A gallery section, a subsection, or a stop within those sections
    Component: {
      components: list('Guide Component', {
        ...commonContentFields,
      }),
    },
  },
};

export default digitalGuides;
