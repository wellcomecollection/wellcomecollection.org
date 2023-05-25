import { CustomType } from './types/CustomType';
import title from './parts/title';
import { documentLink, mediaLink } from './parts/link';
import list from './parts/list';
import image from './parts/image';
import { multiLineText, singleLineText } from './parts/text';
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
      'related-exhibition': documentLink('Related Exhibition', {
        linkedType: 'exhibitions',
      }),
      introText: multiLineText('Introductory text', {
        placeholder:
          "This will fallback to the related exhibition's promo text if not filled in",
      }),
    },
    // We are providing a repeatable list of guide components which could be:
    // A gallery section, a subsection, or a stop within those sections
    // We did have an extra field 'partOf' where editors can indicate what section or subsection
    // a stop is related to, but removed this to get a first iteration and think about hierarchy structure later
    Components: {
      components: list('Guide Component', {
        standaloneTitle: singleLineText('Standalone title', {
          placeholder:
            'Provides a group heading for stops on captions and transcription pages',
        }),
        title,
        // Info on the choice for the name 'tombstone' instead of e.g. 'creator'
        // https://wellcome.slack.com/archives/CUA669WHH/p1658396258859169
        tombstone: singleLineText('Tombstone'),
        caption: multiLineText('Caption'),
        image: image('image'),
        number: number('Stop number', {
          placeholder: 'Stop number for this content',
        }),
        context: multiLineText('Context', {
          placeholder: 'Optional context for a group of stops',
        }),
        'audio-with-description': mediaLink(
          'Audio with description (.mp3 file)'
        ),
        'audio-without-description': mediaLink(
          'Audio without description (.mp3 file)'
        ),
        'bsl-video': embed('Embed (Youtube)'),
        transcript: multiLineText('Transcript'),
      }),
    },
  },
  format: 'custom',
};

export default exhibitionGuides;
