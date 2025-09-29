import { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';

import { articleBasic } from '@weco/cardigan/stories/data/content';
import { contentAPIArticle } from '@weco/cardigan/stories/data/contentAPI.content';
import StoryCard from '@weco/content/views/components/StoryCard';

const meta: Meta<typeof StoryCard> = {
  title: 'Components/Cards/StoryCard',
  component: StoryCard,
  args: {
    variant: 'contentApi',
    article: contentAPIArticle,
    hidePromoText: false,
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
    hidePromoText: {
      name: 'Hide promo text',
      control: { type: 'boolean' },
    },
    article: { table: { disable: true } },
    sizesQueries: { table: { disable: true } },
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

type Story = StoryObj<typeof StoryCard>;

const StoryCardStory = args => {
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

  return <StoryCard {...finalArgs} />;
};

export const Basic: Story = {
  name: 'StoryCard',
  render: args => <StoryCardStory {...args} />,
};
