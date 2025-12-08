import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import styled from 'styled-components';

import { organisation, user } from '@weco/common/icons';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import CollaboratorCard from '@weco/content/views/pages/concepts/concept/concept.Collaborators.Card';

type StoryProps = ComponentProps<typeof CollaboratorCard> & {
  numberOfCards: number;
};

const meta: Meta<StoryProps> = {
  title: 'Components/Cards/CollaboratorCard',
  component: CollaboratorCard,
  args: {
    href: '/concepts/1234567',
    label: 'This is some text',
    icon: user,
    numberOfCards: 1,
  },
  argTypes: {
    href: {
      table: {
        disable: true,
      },
    },
    icon: {
      options: ['user', 'organisation'],
      control: 'radio',
      mapping: {
        user,
        organisation,
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

type Story = StoryObj<StoryProps>;

const CollaboratorsWrapper = styled(Grid)`
  max-width: 792px;
  gap: ${props => props.theme.spacingUnits['5']};
  row-gap: ${props => props.theme.spacingUnits['4']};
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
          key={`card-${i}`}
        >
          <CollaboratorCard {...args} />
        </GridCell>
      ))}
    </CollaboratorsWrapper>
  ),
};
