import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { event } from '@weco/cardigan/stories/data/content';
import EventPromo from '@weco/content/views/components/EventPromo';
import Readme from '@weco/content/views/components/EventPromo/README.mdx';

const meta: Meta<typeof EventPromo> = {
  title: 'Components/Cards/EventPromo',
  component: EventPromo,
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

type Story = StoryObj<typeof EventPromo>;

const Template = args => (
  <div style={{ maxWidth: '400px' }}>
    <EventPromo {...args} />
  </div>
);

export const Basic: Story = {
  name: 'EventPromo',
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
