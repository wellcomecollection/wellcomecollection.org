import { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';

import {
  articleBasic,
  contentAPIArticle,
} from '@weco/cardigan/stories/data/content';
import StoryPromo from '@weco/content/components/StoryPromo';

const meta: Meta<typeof StoryPromo> = {
  title: 'Components/Cards/StoryPromo',
  component: StoryPromo,
  args: {
    variant: 'contentApi',
    article: contentAPIArticle,
  },
  argTypes: {
    variant: {
      name: 'Data source',
      control: { type: 'select' },
      options: ['Prismic', 'Content API'],
      mapping: {
        Prismic: 'prismic',
        'Content API': 'contentApi',
      },
    },
    article: { table: { disable: true } },
    sizesQueries: { table: { disable: true } },
    hidePromoText: {
      name: 'Hide promo text',
      control: { type: 'boolean' },
    },
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

const StoryPromoStory = args => {
  const { variant } = args;
  const [finalArgs, setFinalArgs] = useState({
    variant,
    ...args,
    ...{ article: variant === 'prismic' ? articleBasic : contentAPIArticle },
  });

  useEffect(() => {
    setFinalArgs({
      variant,
      ...args,
      ...{ article: variant === 'prismic' ? articleBasic : contentAPIArticle },
    });
  }, [args]);

  return <StoryPromo {...finalArgs} />;
};

export const Basic: Story = {
  args: {
    hidePromoText: true,
  },

  name: 'StoryPromo',
  render: args => <StoryPromoStory {...args} />,
};
