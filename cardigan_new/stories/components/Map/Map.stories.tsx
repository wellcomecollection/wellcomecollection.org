import { Meta, StoryObj } from '@storybook/react';

import Map from '@weco/content/components/Map/Map';

const meta: Meta<typeof Map> = {
  title: 'Components/Map',
  component: Map,
  args: {
    title: 'Getting here',
    latitude: 51.526053,
    longitude: -0.1333271,
  },
  parameters: {
    chromatic: {
      // I tried to delay the snapshot for 15s (the max) and it still gives an error.
      // This still allows the Canvas view, it just won't snapshot/compare it.
      disableSnapshot: true,
    },
  },
};

export default meta;

type Story = StoryObj<typeof Map>;

export const Basic: Story = {
  name: 'Map',
};
