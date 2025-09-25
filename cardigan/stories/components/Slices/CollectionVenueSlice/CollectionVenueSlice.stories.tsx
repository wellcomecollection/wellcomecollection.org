import { Meta, StoryObj } from '@storybook/react';

import { collectionVenueSlice } from '@weco/cardigan/stories/data/slices';
import CollectionVenue from '@weco/common/views/slices/CollectionVenue';

const meta: Meta<typeof CollectionVenue> = {
  title: 'Slices/CollectionVenue',
  component: CollectionVenue,
  args: { slice: collectionVenueSlice },
  argTypes: {
    slice: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<typeof CollectionVenue>;

export const Basic: Story = {
  name: 'CollectionVenue',
  render: args => {
    return (
      <>
        <CollectionVenue {...args} />

        <p style={{ marginTop: '50px' }}>
          Component used: None, it is custom code used to render the Collection
          Venue content type.
        </p>
      </>
    );
  },
};
