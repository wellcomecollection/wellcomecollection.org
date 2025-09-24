import { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';

import { articleBasic } from '@weco/cardigan/stories/data/content';
import { contentAPIArticle } from '@weco/cardigan/stories/data/contentAPI.content';
import StoryPromo from '@weco/content/views/components/StoryPromo';

const meta: Meta<typeof StoryPromo> = {
  title: 'Components/Cards/StoryPromo',
  component: StoryPromo,
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
  name: 'StoryPromo',
  render: args => <StoryPromoStory {...args} />,
};
