import { Meta, StoryObj } from '@storybook/react';

import ArchiveCard from '@weco/content/views/components/ArchiveCard';

const meta: Meta<typeof ArchiveCard> = {
  title: 'Components/Cards/ArchiveCard',
  component: ArchiveCard,
  args: {
    id: 'cardigan',
    label: 'Personal archives',
    title: 'Audrey Amiss',
    description:
      'The paintings were created by people, adults and children, who experienced migraines depicting typical signs and symptoms of the acute migraine attack.',
    contributor: 'Audrey Amiss',
    date: '1933-2013',
    isOrganisation: false,
    extent:
      '1190 volumes, 152 paintings, 136 prints, 91 drawings, 13 folders, 33 files, 8 disc films, 2 objects and 2 embroideries',
  },
  argTypes: {
    id: { table: { disable: true } },
  },
  parameters: {
    gridSizes: {
      s: [12],
      m: [6],
      l: [4],
      xl: [4],
    },
  },
};

export default meta;

type Story = StoryObj<typeof ArchiveCard>;

export const ArchiveCardStory: Story = {
  name: 'ArchiveCard',
  render: args => <ArchiveCard {...args} />,
};
