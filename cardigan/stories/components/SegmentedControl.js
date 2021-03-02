import { storiesOf } from '@storybook/react';
import SegmentedControl from '../../../common/views/components/SegmentedControl/SegmentedControl';
import Readme from '../../../common/views/components/SegmentedControl/README.md';

const SegmentedControlExample = () => {
  return (
    <SegmentedControl
      id={'test'}
      activeId={1}
      items={[
        { id: 1, url: '#', text: 'Everything' },
        { id: 2, url: '#', text: 'Today' },
        { id: 3, url: '#', text: 'This weekend' },
      ]}
    />
  );
};

const stories = storiesOf('Components', module);
stories.add('SegmentedControl', SegmentedControlExample, {
  readme: { sidebar: Readme },
});
