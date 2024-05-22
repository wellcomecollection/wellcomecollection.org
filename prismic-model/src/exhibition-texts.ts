import { CustomType } from './types/CustomType';
import title from './parts/title';
import { documentLink } from './parts/link';
import list from './parts/list';
import { multiLineText } from './parts/text';

const exhibitionTexts: CustomType = {
  id: 'exhibition-texts',
  label: 'Exhibition text',
  repeatable: true,
  status: true,
  json: {
    Main: {
      title,
      'related-exhibition': documentLink('Related Exhibition', {
        linkedType: 'exhibitions',
      }),
      introText: multiLineText('Introductory text', {
        placeholder:
          "This will fallback to the related exhibition's promo text if not filled in",
      }),
    },
    Components: {
      components: list('Text Component', {
        standaloneTitle: multiLineText('Standalone title', {
          placeholder: 'Provides a group heading for following components',
        }),
        context: multiLineText('Context', {
          placeholder: 'Optional context for a group of components',
        }),
        title,
        // Info on the choice for the name 'tombstone' instead of e.g. 'creator'
        // https://wellcome.slack.com/archives/CUA669WHH/p1658396258859169
        tombstone: multiLineText('Tombstone'),
        caption: multiLineText('Caption'),
      }),
    },
  },
  format: 'custom',
};

export default exhibitionTexts;
