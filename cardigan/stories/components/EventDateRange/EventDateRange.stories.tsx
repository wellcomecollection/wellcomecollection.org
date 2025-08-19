import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import EventDateRange from '@weco/content/views/components/EventDateRange';
import Readme from '@weco/content/views/components/EventDateRange/README.mdx';

const dateString = '2022-03-01T13:15:00Z';

const now = new Date(dateString);
const firstDate = new Date(dateString);
const secondDate = new Date(dateString);
const thirdDate = new Date(dateString);
const fourthDate = new Date(dateString);
const fifthDate = new Date(dateString);

firstDate.setHours(now.getHours() - 48);
secondDate.setMinutes(now.getMinutes() + 1);
thirdDate.setHours(now.getHours() + 24);
fourthDate.setHours(secondDate.getHours() + 24);
fifthDate.setHours(thirdDate.getHours() + 24);

const eventTimes = [
  {
    range: {
      startDateTime: firstDate,
      endDateTime: thirdDate,
    },
    isFullyBooked: { inVenue: false, online: false },
  },
  {
    range: {
      startDateTime: secondDate,
      endDateTime: fourthDate,
    },
    isFullyBooked: { inVenue: false, online: false },
  },
  {
    range: {
      startDateTime: thirdDate,
      endDateTime: fifthDate,
    },
    isFullyBooked: { inVenue: false, online: false },
  },
];

const meta: Meta<typeof EventDateRange> = {
  title: 'Components/EventDateRange',
  component: EventDateRange,
  args: {
    eventTimes,
  },
  argTypes: {
    eventTimes: { table: { disable: true } },
    fromDate: { table: { disable: true } },
    isInPastListing: { table: { disable: true } },
    splitTime: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<typeof EventDateRange>;

export const Basic: Story = {
  name: 'EventDateRange',
  render: args => (
    <ReadmeDecorator
      WrappedComponent={EventDateRange}
      args={args}
      Readme={Readme}
    />
  ),
};
