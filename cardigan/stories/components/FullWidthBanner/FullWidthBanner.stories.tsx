import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';

import { imageWithCrops } from '@weco/cardigan/stories/data/images';
import FullWidthBanner from '@weco/content/views/components/FullWidthBanner';

const supportTextCopy =
  'Visit the Reading Room to see items from our collection up close.';
const callToActionCopy = 'Explore our collections';

type StoryProps = ComponentProps<typeof FullWidthBanner> & {
  linkNumber?: number;
  supportTextCopy?: string;
  callToActionCopy?: string;
};

const meta: Meta<StoryProps> = {
  title: 'Components/FullWidthBanner',
  component: FullWidthBanner,
  args: {
    variant: 'default',
    title: 'Discover more about our collections',
    description:
      'Explore the stories behind our collections, including highlights from our archives and library, and find out how to access them.',
    image: imageWithCrops,
    callToAction: {
      text: callToActionCopy,
      url: '#',
    },
    callToActionCopy,
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
    callToAction: { table: { disable: true } },
    callToActionCopy: {
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
      finalArgs = {
        ...args,
        links: {
          ...(args.linkNumber > 0 && {
            firstLink: {
              text: 'Visit the Reading Room',
              url: '#',
            },
          }),
          ...(args.linkNumber > 1 && {
            secondLink: {
              text: 'Explore our collections',
              url: '#',
            },
          }),
        },
      };
    } else {
      finalArgs = {
        ...args,
        callToAction: {
          text: args.callToActionCopy,
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
