import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';

import DateRange from '@weco/content/views/components/DateRange';

// Extend the story type
type DateRangeStoryProps = ComponentProps<typeof DateRange> & {
  scenario:
    | 'Same day'
    | 'Across multiple days'
    | 'With date/time on separate lines';
};

const now = new Date('2022-03-01T13:15:00Z');
const oneHourFromNow = new Date('2022-03-01T13:15:00Z');
oneHourFromNow.setHours(now.getHours() + 1);
const oneWeekFromNow = new Date('2022-03-01T13:15:00Z');
oneWeekFromNow.setHours(now.getHours() + 168);

const meta: Meta<DateRangeStoryProps> = {
  title: 'Components/DateRanges/DateRange',
  component: DateRange,
  args: {
    start: now,
    end: oneHourFromNow,
    splitTime: true,
    scenario: 'Same day',
  },
  argTypes: {
    splitTime: {
      name: 'Split line for time',
    },
    scenario: {
      control: { type: 'radio' },
      options: ['Same day', 'Across multiple days'],
    },
    start: { table: { disable: true } },
    end: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<DateRangeStoryProps>;
export const Basic: Story = {
  name: 'DateRange',
  render: args => {
    let finalArgs = args;
    switch (args.scenario) {
      case 'Across multiple days':
        finalArgs = { ...args, start: now, end: oneWeekFromNow };
        break;
    }

    return <DateRange {...finalArgs} />;
  },
};
