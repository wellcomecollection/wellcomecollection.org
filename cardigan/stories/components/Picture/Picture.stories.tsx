import { Meta, StoryObj } from '@storybook/react';

import {
  florenceWinterfloodImageUrl,
  image,
} from '@weco/cardigan/stories/data/images';
import Picture from '@weco/common/views/components/Picture';

const meta: Meta<typeof Picture> = {
  title: 'Components/Picture',
  component: Picture,
  args: {
    images: [
      image(florenceWinterfloodImageUrl('3200x1800'), 3200, 1800, {
        minWidth: '600px',
      }),
      image(florenceWinterfloodImageUrl('3200x3200'), 3200, 3200),
    ],
    isFull: false,
  },
  argTypes: {
    images: { table: { disable: true } },
    isFull: { control: 'boolean', name: 'Display Tasl at the top' },
  },
};

export default meta;

type Story = StoryObj<typeof Picture>;

export const Basic: Story = {
  name: 'Picture',
  render: args => (
    <div style={{ maxWidth: '500px' }}>
      <Picture {...args} />
    </div>
  ),
};
