import { Meta, StoryObj } from '@storybook/react';

import CollaboratorCard from '@weco/content/components/CollaboratorCard';
import { user } from '@weco/common/icons';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';

const meta: Meta<typeof CollaboratorCard> = {
  title: 'Components/Cards/CollaboratorCard',
  component: CollaboratorCard,
  args: {
    href: '/concepts/1234567',
    label: 'This is some text',
    icon: user,
  },
  argTypes: {
    icon: {
      table: {
        disable: true,
      },
    },
  }
};

export default meta;

type Story = StoryObj<typeof CollaboratorCard>;

export const Basic: Story = {
  name: 'CollaboratorCard',
  render: args => (
    <Grid>
      <GridCell
        $sizeMap={{
          s: [12],
          m: [4],
          l: [4],
          xl: [4],
        }}
      >
        <CollaboratorCard {...args} />
      </GridCell>
    </Grid>
  ),
};
