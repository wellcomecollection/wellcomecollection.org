import title from './parts/title';
import visualStoryBody from './parts/visual-story-body';
import timestamp from './parts/timestamp';
import boolean from './parts/boolean';
import { CustomType } from './types/CustomType';

const visualStories: CustomType = {
  id: 'visual-stories',
  label: 'Visual story',
  repeatable: true,
  status: true,
  json: {
    Main: {
      title,
      datePublished: timestamp('Date published'),
      showOnThisPage: boolean(
        "Show 'On this page' anchor links. This will only appear if there are more than 2 H2s in the body",
        { defaultValue: true }
      ),
      body: visualStoryBody,
    },
  },
  format: 'custom',
};

export default visualStories;
