import { Meta, StoryObj } from '@storybook/react';

import { libraryVenue } from '@weco/common/test/fixtures/components/library-venue';
import VenueClosedPeriods from '@weco/content/views/components/VenueClosedPeriods';

const meta: Meta<typeof VenueClosedPeriods> = {
  title: 'Components/VenueHours/VenueClosedPeriods',
  component: VenueClosedPeriods,
  args: {
    venue: libraryVenue,
  },
  argTypes: {
    venue: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<typeof VenueClosedPeriods>;

export const Basic: Story = {
  name: 'VenueClosedPeriods',
};
