import { Meta, StoryObj } from '@storybook/react';

import { exhibitionBasic } from '@weco/cardigan/stories/data/content';
import ExhibitionCard from '@weco/content/views/components/CardGrid/CardGrid.ExhibitionCard';

const meta: Meta<typeof ExhibitionCard> = {
  title: 'Components/Cards/ExhibitionCard',
  component: ExhibitionCard,
  args: {
    exhibition: exhibitionBasic,
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

type Story = StoryObj<typeof ExhibitionCard>;

export const Basic: Story = {
  name: 'ExhibitionCard',
};
