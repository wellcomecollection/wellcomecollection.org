import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import EventDatesLink from '@weco/content/components/EventDatesLink';
import Readme from '@weco/content/components/EventDatesLink/README.mdx';

const meta: Meta<typeof EventDatesLink> = {
  title: 'Components/EventDatesLink',
  component: EventDatesLink,
  args: {
    id: 'test',
  },
};

export default meta;

type Story = StoryObj<typeof EventDatesLink>;

export const Basic: Story = {
  name: 'EventDatesLink',
  render: args => (
    <ReadmeDecorator
      WrappedComponent={EventDatesLink}
      args={args}
      Readme={Readme}
    />
  ),
};
