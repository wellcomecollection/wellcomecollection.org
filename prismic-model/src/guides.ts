import title from './parts/title';
import body from './parts/body';
import promo from './parts/promo';
import { documentLink } from './parts/link';
import timestamp from './parts/timestamp';
import { singleLineText } from './parts/text';
import boolean from './parts/boolean';
import { CustomType } from './types/CustomType';

const guides: CustomType = {
  id: 'guides',
  label: 'Guide',
  repeatable: true,
  status: true,
  json: {
    Guide: {
      title,
      format: documentLink('Format', { linkedType: 'guide-formats' }),
      datePublished: timestamp('Date published'),
      showOnThisPage: boolean(
        "Show 'On this page' anchor links. This will only appear if there are more than 2 H2s in the body",
        { defaultValue: false }
      ),
      body,
    },
    Promo: {
      promo,
    },
    Metadata: {
      metadataDescription: singleLineText('Metadata description'),
    },
  },
  format: 'custom',
};

export default guides;
