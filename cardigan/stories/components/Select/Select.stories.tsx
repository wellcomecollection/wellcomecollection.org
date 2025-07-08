import { Meta, StoryObj } from '@storybook/react';

import Select from '@weco/content/views/components/Select';

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  args: {
    name: 'sortBy',
    label: 'sort by',
    options: [
      { text: 'Relevance' },
      { text: 'Oldest to newest' },
      { text: 'Newest to oldest' },
    ],
  },
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Basic: Story = {
  name: 'Select',
};
