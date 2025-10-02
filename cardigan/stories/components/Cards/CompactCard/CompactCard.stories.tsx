import { Meta, StoryObj } from '@storybook/react';

import { articleBasic } from '@weco/cardigan/stories/data/content';
import {
  imageWithCrops,
  squareImage,
} from '@weco/cardigan/stories/data/images';
import { singleLineOfText } from '@weco/cardigan/stories/data/text';
import PrismicImage from '@weco/common/views/components/PrismicImage';
import CompactCard from '@weco/content/views/components/CompactCard';

const primaryLabelList = [{ text: 'Study day' }, { text: 'Schools' }];
const secondaryLabelList = [{ text: 'Speech-to-text' }];
const imageProps = squareImage();

const meta: Meta<typeof CompactCard> = {
  title: 'Components/Cards/CompactCard',
  component: CompactCard,
  args: {
    url: 'https://wellcomecollection.org',
    title: 'Wellcome Collection',
    description: singleLineOfText(),
    Image: <PrismicImage image={imageProps} quality="low" />,
    primaryLabels: primaryLabelList,
    secondaryLabels: secondaryLabelList,
    xOfY: { x: 1, y: 1 },
    variant: 'default',
  },
  argTypes: {
    title: { control: 'text', if: { arg: 'variant', neq: 'article' } },
    description: { control: 'text', if: { arg: 'variant', neq: 'article' } },
    variant: { control: 'select', options: ['default', 'article'] },
    showPosition: { control: 'boolean', if: { arg: 'variant', eq: 'article' } },
    url: { table: { disable: true } },
    primaryLabels: { table: { disable: true } },
    xOfY: { table: { disable: true } },
    secondaryLabels: { table: { disable: true } },
    Image: { table: { disable: true } },
  },
  parameters: {
    gridSizes: {
      s: [12],
      m: [10],
      l: [8],
      xl: [8],
    },
  },
};

export default meta;

const Template = args => {
  const finalArgs =
    args && args.variant === 'article'
      ? {
          variant: 'article',
          article: {
            ...articleBasic,
            image: imageWithCrops,
            series: [
              {
                id: 'YxnFmxEAAHzJngrE',
                uid: 'the-hidden-side-of-violence',
                title: 'The Hidden Side of Violence',
                labels: [{ text: 'Serial' }],
                type: 'series',
                schedule: [
                  {
                    type: 'article-schedule-items',
                    id: articleBasic.id,
                    title: articleBasic.title,
                    publishDate: new Date('2022-09-29T09:00:00.000Z'),
                    partNumber: 2,
                  },
                ],
                color: 'accent.salmon',
              },
            ],
          },
          xOfY: { x: 1, y: 1 },
          showPosition: true,
        }
      : args;

  return <CompactCard {...finalArgs} />;
};

type Story = StoryObj<typeof CompactCard>;
export const CompactCardStory: Story = {
  name: 'CompactCard',
  render: Template,
};
