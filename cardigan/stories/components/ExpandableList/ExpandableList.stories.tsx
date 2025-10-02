import { Meta, StoryObj } from '@storybook/react';

import ExpandableList from '@weco/content/views/components/ExpandableList';

const meta: Meta<typeof ExpandableList> = {
  title: 'Components/ExpandableList',
  component: ExpandableList,
  args: {
    listItems: [
      'Item 1',
      'Item 2',
      'Item 3',
      'Item 4',
      'Item 5',
      'Item 6',
      'Item 7',
      'Item 8',
    ],
    initialItems: 3,
  },
  argTypes: {
    listItems: { table: { disable: true } },
    initialItems: { control: { type: 'range', min: 1, max: 8 } },
  },
};

export default meta;

type Story = StoryObj<typeof ExpandableList>;

export const Basic: Story = {
  name: 'ExpandableList',
  render: args => <ExpandableList {...args} />,
};
