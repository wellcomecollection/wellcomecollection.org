import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps, useEffect, useState } from 'react';

import {
  articleBasic,
  event,
  exhibitionBasic,
} from '@weco/cardigan/stories/data/content';
import { contentAPIArticle } from '@weco/cardigan/stories/data/contentAPI.content';
import { Article } from '@weco/content/services/wellcome/content/types/api';
import { MultiContent } from '@weco/content/types/multi-content';
import CardGrid from '@weco/content/views/components/CardGrid';

const sources = ['Prismic', 'ContentAPI'] as const;
const types = ['Article', 'Exhibition', 'Event'] as const;

type StoryProps = ComponentProps<typeof CardGrid> & {
  dataSource: (typeof sources)[number];
  contentType: (typeof types)[number];
};

const meta: Meta<StoryProps> = {
  title: 'Components/CardGrid',
  component: CardGrid,
  args: {
    itemsPerRow: 3,
    dataSource: 'Prismic',
    contentType: 'Article',
  },
  argTypes: {
    items: { table: { disable: true } },
    dataSource: {
      control: { type: 'radio' },
      options: sources,
      name: 'Data source',
      if: { arg: 'contentType', eq: 'Article' },
    },
    contentType: {
      control: { type: 'select' },
      options: types,
      name: 'Content type',
    },
    itemsPerRow: { control: 'number', name: 'Items per row' },
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

const getContent = (
  source: (typeof sources)[number],
  type: (typeof types)[number]
): MultiContent[] | Article[] => {
  if (type === 'Article')
    return source === 'ContentAPI' ? [contentAPIArticle] : [articleBasic];

  if (type === 'Exhibition') return [exhibitionBasic];

  if (type === 'Event') return [event];

  return [];
};

const Template = args => {
  const [items, setItems] = useState<readonly MultiContent[] | Article[]>([]);

  useEffect(() => {
    setItems(getContent(args.dataSource, args.contentType));
  }, [args.dataSource, args.contentType]);

  return <CardGrid {...args} items={items} />;
};

export const Basic: Story = {
  name: 'CardGrid',
  render: Template,
};
