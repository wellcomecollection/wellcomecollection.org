import * as prismic from '@prismicio/client';
import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';

import Caption from '@weco/common/views/components/Caption';

type StoryProps = ComponentProps<typeof Caption> & {
  captionCopy: string;
  hasPreCaptionNode: boolean;
};

const captionCopyString =
  'The newspapers and news pamphlets, gathered by the Reverend Charles Burney (1757-1817) include more than 1,000 pamphlets, proclamations, newsbooks and newspapers from the period.';

const meta: Meta<StoryProps> = {
  title: 'Components/Caption',
  component: Caption,
  args: {
    caption: [
      {
        type: 'paragraph',
        text: captionCopyString,
        spans: [],
      },
    ],
    captionCopy: captionCopyString,
    width: 400,
    hasPreCaptionNode: false,
    preCaptionNode: (
      <p>
        <strong>Note:</strong> This is a pre-caption node, it could have any
        HTML.
      </p>
    ),
  },
  argTypes: {
    preCaptionNode: { table: { disable: true } },
    caption: { table: { disable: true } },
    width: { control: 'number', name: 'Width (px)' },
    captionCopy: { control: 'text', name: 'Caption copy' },
    hasPreCaptionNode: { control: 'boolean', name: 'Has pre-caption node' },
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Basic: Story = {
  name: 'Caption',
  render: args => {
    const { captionCopy, hasPreCaptionNode, preCaptionNode, ...rest } = args;

    const finalArgs = {
      ...rest,
      caption: [
        {
          type: 'paragraph',
          text: captionCopyString,
          spans: [],
        },
      ] as prismic.RichTextField,
      preCaptionNode: hasPreCaptionNode ? preCaptionNode : undefined,
    };

    return <Caption {...finalArgs} />;
  },
};
