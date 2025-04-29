import { Meta, StoryObj } from '@storybook/react';

import { libraryVenue } from '@weco/common/test/fixtures/components/library-venue';
import VenueClosedPeriods from '@weco/content/components/VenueClosedPeriods';

const meta: Meta<typeof VenueClosedPeriods> = {
  title: 'Components/VenueClosedPeriods',
  component: VenueClosedPeriods,
  args: {
    venue: libraryVenue,
  },
};

export default meta;

type Story = StoryObj<typeof VenueClosedPeriods>;

export const Basic: Story = {
  name: 'VenueClosedPeriods',
};
