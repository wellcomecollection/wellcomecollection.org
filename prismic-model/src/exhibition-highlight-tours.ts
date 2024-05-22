import title from './parts/title';
import { documentLink, mediaLink } from './parts/link';
import list from './parts/list';
import { multiLineText } from './parts/text';
import embed from './parts/embed';
import number from './parts/number';

const exhibitionHighlightTours = {
  id: 'exhibition-highlight-tour',
  label: 'Exhibition highlight tour',
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
    Stops: {
      stops: list('Stop', {
        title,
        number: number('Stop number', {
          placeholder: 'Stop number for this content',
        }),
        'audio-with-description': mediaLink(
          'Audio with description (.mp3 file)'
        ),
        'bsl-video': embed('Embed (Youtube)'),
        transcript: multiLineText('Transcript'),
      }),
    },
  },
  format: 'custom',
};

export default exhibitionHighlightTours;
