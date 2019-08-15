import { storiesOf } from '@storybook/react';
import FeaturedText from '../../../common/views/components/FeaturedText/FeaturedText';
import Readme from '../../../common/views/components/FeaturedText/README.md';
import { text } from '@storybook/addon-knobs/react';

const stories = storiesOf('Components', module);

stories.add(
  'FeaturedText',
  () => (
    <FeaturedText
      html={[
        {
          type: 'paragraph',
          text: text(
            'Text',
            'Walk inside an innovative mobile clinic, and follow its development from the early prototypes to the first complete version.'
          ),
          spans: [],
        },
      ]}
    />
  ),
  {
    readme: { sidebar: Readme },
  }
);
