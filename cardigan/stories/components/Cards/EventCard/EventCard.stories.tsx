import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps, useEffect, useState } from 'react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { event } from '@weco/cardigan/stories/data/content';
import EventCard from '@weco/content/views/components/EventCard';
import Readme from '@weco/content/views/components/EventCard/README.mdx';

type StoryProps = ComponentProps<typeof EventCard> & {
  isOnline: boolean;
  isAvailableOnline: boolean;
  isPast: boolean;
};

const meta: Meta<StoryProps> = {
  title: 'Components/Cards/EventCard',
  component: EventCard,
  args: {
    position: 0,
    event,
    isOnline: true,
    isAvailableOnline: true,
    isPast: false,
  },
  argTypes: {
    position: { table: { disable: true } },
    event: { table: { disable: true } },
    fromDate: { table: { disable: true } },
    dateString: { table: { disable: true } },
    timeString: { table: { disable: true } },
    isInPastListing: { table: { disable: true } },
    isPast: { control: 'boolean', name: 'Is in the past' },
    isAvailableOnline: { control: 'boolean', name: 'Available online' },
    isOnline: { control: 'boolean', name: 'Event happens online' },
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

const Template = (args: StoryProps) => {
  const {
    isOnline,
    isAvailableOnline,
    isPast,
    event: passedEvent,
    ...rest
  } = args;
  const [finalEventValue, setFinalEventValue] = useState(passedEvent);

  useEffect(() => {
    setFinalEventValue({
      ...passedEvent,
      isOnline: isOnline,
      availableOnline: isAvailableOnline,
      isPast: isPast,
    });
  }, [isOnline, isAvailableOnline, isPast, passedEvent]);

  return (
    <div style={{ maxWidth: '400px' }}>
      <EventCard event={finalEventValue} {...rest} />
    </div>
  );
};

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
