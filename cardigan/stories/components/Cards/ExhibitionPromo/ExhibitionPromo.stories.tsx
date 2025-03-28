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
      s: [12],
      m: [6],
      l: [4],
      xl: [4],
    },
  },
};

export default meta;

type Story = StoryObj<typeof ExhibitionPromo>;

export const Basic: Story = {
  name: 'ExhibitionPromo',
};
