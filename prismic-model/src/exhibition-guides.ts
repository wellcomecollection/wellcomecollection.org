import { CustomType } from './types/CustomType';
import title from './parts/title';
import link from './parts/link';
import list from './parts/list';
import image from './parts/image';
import structuredText from './parts/structured-text';
import embed from './parts/embed';
import number from './parts/number';

const exhibitionGuides: CustomType = {
  id: 'exhibition-guides',
  label: 'Exhibition guide',
  repeatable: true,
  status: true,
  json: {
    Guide: {
      title,
      'related-exhibition': link('Related Exhibition', 'document', [
        'exhibitions',
      ]),
    },
    // We are providing a repeatable list of guide components which could be:
    // A gallery section, a subsection, or a stop within those sections
    // We did have an extra field 'partOf' where editors can indicate what section or subsection
    // a stop is related to, but removed this to get a first iteration and think about hierarchy structure later
    Components: {
      components: list('Guide Component', {
        number: number('Position number'),
        title,
        tombstone: structuredText('Tombstone', 'single'),
        // Info on the choice for the name tombstone instead of creator
        // https://wellcome.slack.com/archives/CUA669WHH/p1658396258859169
        image: image('image'),
        description: structuredText('Description ', 'single'),
        'audio-with-description': link('Audio with description', 'media', []),
        'audio-without-description': link(
          'Audio without description',
          'media',
          []
        ),
        'bsl-video': embed('Embed (Youtube)'),
        caption: structuredText('Caption', 'multi'),
        transcript: structuredText('Transcript', 'multi'),
      }),
    },
  },
};

export default exhibitionGuides;
