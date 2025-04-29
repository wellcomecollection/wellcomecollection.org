import { Meta, StoryObj } from '@storybook/react';

import Label from '@weco/common/views/components/Label';

const meta: Meta<typeof Label> = {
  title: 'Components/Label',
  component: Label,
  args: {
    label: {
      text: 'Audio described',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Label>;

export const Basic: Story = {
  name: 'Label',
};
