import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { event } from '@weco/cardigan/stories/data/content';
import EventCard from '@weco/content/views/components/EventCard';
import Readme from '@weco/content/views/components/EventCard/README.mdx';

const meta: Meta<typeof EventCard> = {
  title: 'Components/Cards/EventCard',
  component: EventCard,
  args: {
    position: 0,
    event,
  },
  argTypes: {
    position: { table: { disable: true } },
    event: { table: { disable: true } },
    fromDate: { table: { disable: true } },
    isInPastListing: { control: 'boolean', name: 'Is in the past' },
    dateString: { control: 'text', name: 'Date string' },
    timeString: { control: 'text', name: 'Time string' },
  },
};

export default meta;

type Story = StoryObj<typeof EventCard>;

const Template = args => (
  <div style={{ maxWidth: '400px' }}>
    <EventCard {...args} />
  </div>
);

export const Basic: Story = {
  name: 'EventCard',
  render: args => {
    return (
      <ReadmeDecorator
        WrappedComponent={Template}
        args={args}
        Readme={Readme}
      />
    );
  },
};
