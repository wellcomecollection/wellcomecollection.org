import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { digitalImage, gridView } from '@weco/common/icons';
import ToolbarSegmentedControl from '@weco/content/views/works/work/IIIFViewer/ToolbarSegmentedControl';

const meta: Meta<typeof ToolbarSegmentedControl> = {
  title: 'Components/Buttons/Alternates/ToolbarSegmentedControl',
  component: ToolbarSegmentedControl,
  args: {
    hideLabels: true,
  },
};

export default meta;

type Story = StoryObj<typeof ToolbarSegmentedControl>;

const ToolbarSegmentedControlTemplate = args => {
  const [activeId, setActiveId] = useState('page');

  return (
    <div style={{ padding: '50px', background: '#333' }}>
      <ToolbarSegmentedControl
        activeId={activeId}
        hideLabels={args.hideLabels}
        items={[
          {
            id: 'page',
            icon: digitalImage,
            label: 'Page',
            clickHandler: () => setActiveId('page'),
          },
          {
            id: 'grid',
            icon: gridView,
            label: 'Grid',
            clickHandler: () => setActiveId('grid'),
          },
        ]}
      />
    </div>
  );
};

export const Basic: Story = {
  name: 'ToolbarSegmentedControl',
  render: ToolbarSegmentedControlTemplate,
};
