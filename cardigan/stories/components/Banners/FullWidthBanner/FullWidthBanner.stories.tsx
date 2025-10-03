import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';

import { imageWithCrops } from '@weco/cardigan/stories/data/images';
import FullWidthBanner from '@weco/content/views/components/FullWidthBanner';

const supportTextCopy =
  'Visit the Reading Room to see items from our collection up close.';
const linkCopy = 'Explore our collections';

type StoryProps = ComponentProps<typeof FullWidthBanner> & {
  linkNumber?: number;
  supportTextCopy?: string;
  linkCopy?: string;
};

const meta: Meta<StoryProps> = {
  title: 'Components/Banners/FullWidthBanner',
  component: FullWidthBanner,
  args: {
    variant: 'default',
    title: 'Discover more about our collections',
    description:
      'Explore the stories behind our collections, including highlights from our archives and library, and find out how to access them.',
    image: imageWithCrops,
    link: {
      text: linkCopy,
      url: '#',
    },
    linkCopy,
    supportText: [
      {
        type: 'paragraph',
        text: supportTextCopy,
        spans: [],
      },
    ],
    supportTextCopy,
    linkNumber: 2,
  },
  argTypes: {
    variant: {
      options: ['default', 'twoLinks'],
      control: { type: 'radio' },
    },
    image: { table: { disable: true } },
    supportText: { table: { disable: true } },
    links: { table: { disable: true } },
    link: { table: { disable: true } },
    linkCopy: {
      name: 'CTA copy',
      type: 'string',
      if: { arg: 'variant', eq: 'default' },
    },
    supportTextCopy: {
      name: 'Support text',
      type: 'string',
      if: { arg: 'variant', eq: 'default' },
    },
    linkNumber: {
      name: 'Link number',
      control: {
        type: 'range',
        min: 0,
        max: 2,
      },
      if: { arg: 'variant', eq: 'twoLinks' },
    },
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Basic: Story = {
  name: 'FullWidthBanner',
  render: args => {
    const { variant } = args;
    let finalArgs = args;

    if (variant === 'twoLinks') {
      const links: { text: string; url: string }[] = [];
      if (args.linkNumber > 0) {
        links.push({
          text: 'Visit the Reading Room',
          url: '#',
        });
      }
      if (args.linkNumber > 1) {
        links.push({
          text: 'History and context of our collections',
          url: '#',
        });
      }
      finalArgs = {
        ...args,
        links,
      };
    } else {
      finalArgs = {
        ...args,
        link: {
          text: args.linkCopy,
          url: '#',
        },
        supportText: [
          {
            type: 'paragraph',
            text: args.supportTextCopy,
            spans: [],
          },
        ],
      };
    }

    return <FullWidthBanner {...finalArgs} />;
  },
};
