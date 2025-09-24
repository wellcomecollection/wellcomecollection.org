import { Meta, StoryObj } from '@storybook/react';

import Loading from '@weco/identity/views/components/Loading';

const meta: Meta<typeof Loading> = {
  title: 'Components/Loading',
  component: Loading,
  parameters: {
    chromatic: {
      delay: 1000,
    },
  },
  args: {
    variant: 'inline',
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['inline', undefined],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Loading>;

export const Basic: Story = {
  name: 'Loading',
  render: args => <Loading {...args} />,
};
