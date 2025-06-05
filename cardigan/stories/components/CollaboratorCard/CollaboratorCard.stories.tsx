import { Meta, StoryObj } from '@storybook/react';

import CollaboratorCard from '@weco/content/components/CollaboratorCard';
import { user, wellcome } from '@weco/common/icons';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import styled from 'styled-components';

const meta: Meta<typeof CollaboratorCard> = {
  title: 'Components/Cards/CollaboratorCard',
  component: CollaboratorCard,
  args: {
    href: '/concepts/1234567',
    label: 'This is some text',
    icon: 'user',
    numberOfCards: 1,
  },
  argTypes: {
    href: {
      table: {
        disable: true,
      },
    },
    icon: {
      options: ['user', 'wellcome'],
      control: 'radio',
      mapping: {
        user: user,
        // TODO: Replace with organisation icon once available
        wellcome: wellcome,
      },
    },
    numberOfCards: {
      control: {
        type: 'range',
        min: 1,
        max: 3,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof CollaboratorCard>;

const CollaboratorsWrapper = styled(Grid)`
  max-width: 792px;
  gap: ${props => props.theme.spacingUnits['5']}px;
  row-gap: ${props => props.theme.spacingUnits['4']}px;
`;

export const Basic: Story = {
  name: 'CollaboratorCard',
  render: args => (
    <CollaboratorsWrapper>
      {Array.from({ length: args.numberOfCards }).map(i => (
        <GridCell
          $sizeMap={{
            s: [12],
            m: [4],
            l: [4],
            xl: [4],
          }}
          key={i}
        >
          <CollaboratorCard {...args} />
        </GridCell>
      ))}
    </CollaboratorsWrapper>
  ),
};
