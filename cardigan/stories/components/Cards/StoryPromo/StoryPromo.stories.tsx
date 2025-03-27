import { Meta, StoryObj } from '@storybook/react';

import { articleBasic } from '@weco/cardigan/stories/data/content';
import StoryPromo from '@weco/content/components/StoryPromo/StoryPromo';

const meta: Meta<typeof StoryPromo> = {
  title: 'Components/Cards/StoryPromo',
  component: StoryPromo,
  args: {
    article: articleBasic,
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

type Story = StoryObj<typeof StoryPromo>;

export const Basic: Story = {
  name: 'StoryPromo',
};
