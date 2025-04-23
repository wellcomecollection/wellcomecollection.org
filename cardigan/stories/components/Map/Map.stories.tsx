import { Meta, StoryObj } from '@storybook/react';

import Map from '@weco/content/components/Map';

const meta: Meta<typeof Map> = {
  title: 'Components/Map',
  component: Map,
  args: {
    title: 'Getting here',
    latitude: 51.526053,
    longitude: -0.1333271,
  },
};

export default meta;

type Story = StoryObj<typeof Map>;

export const Basic: Story = {
  name: 'Map',
};
