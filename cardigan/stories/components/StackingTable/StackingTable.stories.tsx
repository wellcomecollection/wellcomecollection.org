import { Meta, StoryObj } from '@storybook/react';

import StackingTable from '@weco/common/views/components/StackingTable';

const meta: Meta<typeof StackingTable> = {
  title: 'Components/StackingTable',
  component: StackingTable,
  args: {
    columnWidths: [1, 2, 1],
    rows: [
      ['Header 1', 'Header 2', 'Header 3'],
      ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'],
      ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3'],
      ['Row 3 Col 1', 'Row 3 Col 2', 'Row 3 Col 3'],
    ],
    maxWidth: 600,
    plain: false,
  },
  argTypes: {
    plain: { control: 'boolean', name: 'Plain style' },
    maxWidth: { control: 'number', name: 'Maximum width of the table (px)' },
    rows: { table: { disable: true } },
    columnWidths: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<typeof StackingTable>;

export const Basic: Story = {
  name: 'StackingTable',
  render: args => <StackingTable {...args} />,
};
