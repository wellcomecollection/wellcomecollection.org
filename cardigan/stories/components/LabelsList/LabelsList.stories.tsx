import { Meta, StoryObj } from '@storybook/react';

import LabelsList from '@weco/common/views/components/LabelsList';

const meta: Meta<typeof LabelsList> = {
  title: 'Components/LabelsList',
  component: LabelsList,
  args: {
    labels: [{ text: 'Gallery tour' }, { text: 'Audio described' }],
  },
};

export default meta;

type Story = StoryObj<typeof LabelsList>;

export const Basic: Story = {
  name: 'LabelsList',
};
