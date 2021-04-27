import { storiesOf } from '@storybook/react';
import ToolbarSegmentedControl from '../../../common/views/components/ToolbarSegmentedControl/ToolbarSegmentedControl';
import Readme from '../../../common/views/components/ToolbarSegmentedControl/README.md';
import { boolean } from '@storybook/addon-knobs';
import { useState } from 'react';

const ToolbarSegmentedControlExample = () => {
  const [activeId, setActiveId] = useState(1);
  const hideLabels = boolean('Hide labels?', false);

  return (
    <div style={{ padding: '50px', background: '#333' }}>
      <ToolbarSegmentedControl
        activeId={activeId}
        hideLabels={hideLabels}
        items={[
          {
            id: 1,
            icon: 'digitalImage',
            label: 'Page',
            clickHandler: () => setActiveId(1),
          },
          {
            id: 2,
            icon: 'gridView',
            label: 'Grid',
            clickHandler: () => setActiveId(2),
          },
        ]}
      />
    </div>
  );
};

const stories = storiesOf('Components', module);
stories.add('ToolbarSegmentedControl', ToolbarSegmentedControlExample, {
  readme: { sidebar: Readme },
});
