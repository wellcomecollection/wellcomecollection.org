import { Meta, StoryObj } from '@storybook/react';

import { exhibitionBasic } from '@weco/cardigan/stories/data/content';
import ExhibitionPromo from '@weco/content/components/ExhibitionPromo/ExhibitionPromo';

const meta: Meta<typeof ExhibitionPromo> = {
  title: 'Components/Cards/ExhibitionPromo',
  component: ExhibitionPromo,
  args: {
    exhibition: exhibitionBasic,
  },
  parameters: {
    gridSizes: {
      s: ['auto', 12],
      m: ['auto', 6],
      l: ['auto', 4],
      xl: ['auto', 4],
    },
  },
};

export default meta;

type Story = StoryObj<typeof ExhibitionPromo>;

export const Basic: Story = {
  name: 'ExhibitionPromo',
};
