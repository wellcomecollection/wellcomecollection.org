import { Meta, StoryObj } from '@storybook/react';

import HeaderBackground from '@weco/common/views/components/HeaderBackground';

const meta: Meta<typeof HeaderBackground> = {
  title: 'Components/HeaderBackground',
  component: HeaderBackground,
  args: {
    hasWobblyEdge: true,
  },
  argTypes: {
    hasWobblyEdge: { control: 'boolean', name: 'Has wobbly edge' },
  },
};

export default meta;

type Story = StoryObj<typeof HeaderBackground>;

export const Basic: Story = {
  name: 'HeaderBackground',
  render: args => <HeaderBackground {...args} />,
};
