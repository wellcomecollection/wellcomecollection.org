import type { Meta, StoryObj } from '@storybook/react';

import NoEvents from '@weco/content/components/NoEvents';

const meta: Meta<typeof NoEvents> = {
  title: 'Components/NoEvents',
  component: NoEvents,
};

export default meta;

type Story = StoryObj<typeof NoEvents>;

export const Basic: Story = {
  name: 'NoEvents',
  args: {
    isPastListing: true,
  },
};
