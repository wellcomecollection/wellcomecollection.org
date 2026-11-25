import { Meta, StoryObj } from '@storybook/react';

import Map from '@weco/content/views/components/Map';

const meta: Meta<typeof Map> = {
  title: 'Components/Map',
  component: Map,
  parameters: {
    // Everything visible here comes from the Google Maps JS API.
    chromatic: { disableSnapshot: true },
  },
  args: {
    title: 'Getting here',
    latitude: 51.526053,
    longitude: -0.1333271,
  },
  argTypes: {
    title: { table: { disable: true } },
    latitude: { table: { disable: true } },
    longitude: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<typeof Map>;

export const Basic: Story = {
  name: 'Map',
};
