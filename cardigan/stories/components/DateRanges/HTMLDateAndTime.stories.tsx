import { Meta, StoryObj } from '@storybook/react';

import HTMLDateAndTime from '@weco/common/views/components/HTMLDateAndTime';

const baseDate = new Date('2023-11-04T15:30:00Z');
const meta: Meta<typeof HTMLDateAndTime> = {
  title: 'Components/DateRanges/HTMLDateAndTime',
  component: HTMLDateAndTime,
  args: {
    date: baseDate,
    variant: 'date',
  },
  argTypes: {
    date: {
      control: 'select',
      options: [
        'Saturday, 4th November 2023, 15:30',
        'Monday, 1st January 2024, 09:00',
        'Friday, 14th February 2025, 18:45',
      ],
      mapping: {
        'Saturday, 4th November 2023, 15:30': baseDate,
        'Monday, 1st January 2024, 09:00': new Date('2024-01-01T09:00:00Z'),
        'Friday, 14th February 2025, 18:45': new Date('2025-02-14T18:45:00Z'),
      },
      name: 'Date',
    },
    variant: {
      control: 'radio',
      options: ['Date', 'Day date', 'Time'],
      mapping: { Date: 'date', 'Day date': 'dayDate', Time: 'time' },
      name: 'Variant',
    },
  },
};

export default meta;

type Story = StoryObj<typeof HTMLDateAndTime>;

export const Basic: Story = {
  name: 'HTMLDateAndTime',
  render: args => <HTMLDateAndTime {...args} />,
};
