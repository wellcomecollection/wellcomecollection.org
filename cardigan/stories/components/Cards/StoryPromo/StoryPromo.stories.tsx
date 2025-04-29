import { Meta, StoryObj } from '@storybook/react';

import { articleBasic } from '@weco/cardigan/stories/data/content';
import StoryPromo from '@weco/content/components/StoryPromo';

const meta: Meta<typeof StoryPromo> = {
  title: 'Components/Cards/StoryPromo',
  component: StoryPromo,
  args: {
    article: articleBasic,
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

type Story = StoryObj<typeof StoryPromo>;

export const Basic: Story = {
  name: 'StoryPromo',
};
