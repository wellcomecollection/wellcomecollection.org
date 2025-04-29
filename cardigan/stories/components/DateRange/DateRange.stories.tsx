import { Meta, StoryObj } from '@storybook/react';

import DateRange from '@weco/content/components/DateRange';

const now = new Date('2022-03-01T13:15:00Z');
const oneHourFromNow = new Date('2022-03-01T13:15:00Z');
oneHourFromNow.setHours(now.getHours() + 1);
const oneWeekFromNow = new Date('2022-03-01T13:15:00Z');
oneWeekFromNow.setHours(now.getHours() + 168);

const meta: Meta<typeof DateRange> = {
  title: 'Components/DateRange',
  component: DateRange,
};

export default meta;

type Story = StoryObj<typeof DateRange>;

export const SameDay: Story = {
  name: 'Same day',
  args: {
    start: now,
    end: oneHourFromNow,
  },
};

export const MultipleDays: Story = {
  name: 'Across mulitple days',
  args: {
    start: now,
    end: oneWeekFromNow,
  },
};

export const WithSplit: Story = {
  name: 'With date/time on seperate lines',
  args: {
    start: now,
    end: oneHourFromNow,
    splitTime: true,
  },
};
