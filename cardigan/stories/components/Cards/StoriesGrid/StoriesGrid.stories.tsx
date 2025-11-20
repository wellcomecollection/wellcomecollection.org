import { Meta, StoryObj } from '@storybook/react';

import { contentAPIArticle } from '@weco/cardigan/stories/data/contentAPI.content';
import StoriesGrid from '@weco/content/views/components/StoriesGrid';

const meta: Meta<typeof StoriesGrid> = {
  title: 'Components/Cards/StoriesGrid',
  component: StoriesGrid,
  args: {
    articles: [contentAPIArticle],
    isCompact: false,
  },
  argTypes: {
    articles: { table: { disable: true } },
    dynamicImageSizes: { table: { disable: true } },
  },
  parameters: {
    gridSizes: {
      s: [12],
      m: [12],
      l: [10],
      xl: [10],
    },
  },
};

export default meta;

type Story = StoryObj<typeof StoriesGrid>;

const StoriesGridStory = args => {
  return <StoriesGrid {...args} />;
};

export const Basic: Story = {
  name: 'StoriesGrid',
  render: args => <StoriesGridStory {...args} />,
};
