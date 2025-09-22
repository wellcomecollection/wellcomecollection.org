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
    hideLabel: false,
    darkBg: false,
    isPill: false,
  },
  argTypes: {
    name: { table: { disable: true } },
    form: { table: { disable: true } },
    options: { table: { disable: true } },
    onChange: { table: { disable: true } },
    value: { table: { disable: true } },
    label: { control: 'text', name: 'Label' },
    darkBg: { control: 'boolean', name: 'Dark background' },
    hideLabel: { control: 'boolean', name: 'Hide label' },
    isPill: { control: 'boolean', name: 'Is pill' },
  },
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Basic: Story = {
  name: 'Select',
  render: args => {
    return (
      <div style={{ maxWidth: '400px' }}>
        <Select {...args} />
      </div>
    );
  },
};
