import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';

import CollaboratorCards from '@weco/content/views/components/CollaboratorCards';

type StoryProps = ComponentProps<typeof CollaboratorCards> & {
  numberOfCards: number;
};

const meta: Meta<StoryProps> = {
  title: 'Components/Cards/CollaboratorCard',
  component: CollaboratorCards,
  args: {
    collaborators: [
      {
        label: 'Royal College of Physicians of Edinburgh',
        id: 'nvedx6az',
        conceptType: 'Organisation',
      },
      {
        label: 'Francis Darwin',
        id: 'adx5dvg6',
        conceptType: 'Person',
      },
      {
        label: 'Gavin de Beer',
        id: 'jt2q9muw',
        conceptType: 'Person',
      },
      {
        label: 'Royal College of Physicians of Edinburgh',
        id: 'nvedx6az',
        conceptType: 'Organisation',
      },
    ],
    numberOfCards: 2,
  },
  argTypes: {
    collaborators: { table: { disable: true } },
    numberOfCards: {
      control: {
        type: 'range',
        min: 1,
        max: 4,
      },
    },
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

const Template = ({ numberOfCards, ...args }: StoryProps) => {
  return (
    <CollaboratorCards
      {...args}
      collaborators={args.collaborators?.slice(0, numberOfCards)}
    />
  );
};

export const Basic: Story = {
  name: 'CollaboratorCard',
  render: args => <Template {...args} />,
};
