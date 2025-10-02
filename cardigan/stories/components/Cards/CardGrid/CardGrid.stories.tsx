import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';

import { event } from '@weco/cardigan/stories/data/content';
import { contentAPIArticle } from '@weco/cardigan/stories/data/contentAPI.content';
import CardGrid from '@weco/content/views/components/CardGrid';

type StoryProps = ComponentProps<typeof CardGrid> & {
  numberOfCards: number;
  contentType: 'event' | 'article';
  hasLink: boolean;
  hasOptionalComponent: boolean;
};

const meta: Meta<StoryProps> = {
  title: 'Components/Cards/CardGrid',
  component: CardGrid,
  args: {
    itemsPerRow: 3,
    numberOfCards: 1,
    contentType: 'event',
    hidePromoText: false,
    itemsHaveTransparentBackground: true,
    hasLink: false,
    links: [{ text: 'See all events', url: '/events' }],
    isInPastListing: false,
    hasOptionalComponent: false,
  },
  argTypes: {
    items: { table: { disable: true } },
    links: { table: { disable: true } },
    fromDate: { table: { disable: true } },
    optionalComponent: { table: { disable: true } },
    contentType: {
      name: 'Content type',
      options: ['event', 'article'],
      control: { type: 'radio' },
    },
    numberOfCards: {
      control: { type: 'range', min: 1, max: 6, step: 1 },
      name: 'Number of cards',
    },
    itemsPerRow: { control: 'radio', name: 'Items per row', options: [3, 4] },
    hidePromoText: {
      control: 'boolean',
      if: { arg: 'contentType', eq: 'article' },
    },
    itemsHaveTransparentBackground: {
      name: 'Transparent background',
      control: 'boolean',
    },
    hasLink: { name: 'Has CTA', control: 'boolean' },
    isInPastListing: {
      name: 'Is in past listing',
      control: 'boolean',
      if: { arg: 'contentType', eq: 'event' },
    },
    hasOptionalComponent: {
      name: 'Has optional component',
      control: 'boolean',
      if: { arg: 'hasLink', eq: true },
    },
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

const Template = args => {
  return (
    <CardGrid
      {...args}
      links={args.hasLink ? args.links : undefined}
      optionalComponent={
        args.hasOptionalComponent ? (
          <div>Optional component, could be any HTML</div>
        ) : undefined
      }
      items={Array.from({ length: args.numberOfCards }).map((_, i) =>
        args.contentType === 'event'
          ? { ...event, id: `${event.id}-${i}` }
          : { ...contentAPIArticle, id: `${contentAPIArticle.id}-${i}` }
      )}
    />
  );
};

export const Basic: Story = {
  name: 'CardGrid',
  render: Template,
};
