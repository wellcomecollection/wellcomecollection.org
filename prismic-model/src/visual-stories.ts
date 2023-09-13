import title from './parts/title';
import promo from './parts/promo';
import { visualStoryBody } from './parts/bodies';
import timestamp from './parts/timestamp';
import boolean from './parts/boolean';
import { documentLink } from './parts/link';
import { CustomType } from './types/CustomType';

const visualStories: CustomType = {
  id: 'visual-stories',
  label: 'Visual story',
  repeatable: true,
  status: true,
  json: {
    Main: {
      title,
      'related-exhibition': documentLink('Related Exhibition', {
        linkedType: 'exhibitions',
      }),
      datePublished: timestamp('Date published'),
      showOnThisPage: boolean(
        "Show 'On this page' anchor links. This will only appear if there are more than 2 H2s in the body",
        { defaultValue: true }
      ),
      body: visualStoryBody,
    },
    Promo: {
      promo,
    },
  },
  format: 'custom',
};

export default visualStories;
