import { Meta, StoryObj } from '@storybook/react';

import WatchLabel from '@weco/content/views/components/WatchLabel';

const meta: Meta<typeof WatchLabel> = {
  title: 'Components/WatchLabel',
  component: WatchLabel,
  args: {
    text: 'Available to watch',
  },
  argTypes: {
    text: { name: 'Text', control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof WatchLabel>;

export const Basic: Story = {
  name: 'WatchLabel',
  render: args => <WatchLabel {...args} />,
};
