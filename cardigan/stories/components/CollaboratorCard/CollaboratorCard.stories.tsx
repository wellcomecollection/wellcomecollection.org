import { Meta, StoryObj } from '@storybook/react';

import CollaboratorCard from '@weco/content/components/ThemeCollaborators/CollaboratorCard';
import { user } from '@weco/common/icons';

const meta: Meta<typeof CollaboratorCard> = {
  title: 'Components/Cards/CollaboratorCard',
  component: CollaboratorCard,
  args: {
    href: '/concepts/1234567',
    label: 'This is some text',
    icon: user,
  },
};

export default meta;

type Story = StoryObj<typeof CollaboratorCard>;

export const Basic: Story = {
  name: 'CollaboratorCard',
};
