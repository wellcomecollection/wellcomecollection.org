import { storiesOf } from '@storybook/react';
import LabelsList from '../../../common/views/components/LabelsList/LabelsList';
import Readme from '../../../common/views/components/LabelsList/README.md';

const stories = storiesOf('Components', module);
stories.add(
  'LabelsList',
  () => (
    <LabelsList
      labels={[
        { url: null, text: 'Gallery tour' },
        { url: null, text: 'Audio described' },
      ]}
    />
  ),
  { readme: { sidebar: Readme } }
);
