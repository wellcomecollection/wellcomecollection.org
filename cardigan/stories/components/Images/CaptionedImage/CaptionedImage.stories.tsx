import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';

import { captionedImage } from '@weco/cardigan/stories/data/images';
import CaptionedImage from '@weco/content/views/components/CaptionedImage';

// Extend the story type
type CaptionedImageStoryProps = ComponentProps<typeof CaptionedImage> & {
  hasCaption: boolean;
  hasPreCaptionNode: boolean;
};

const meta: Meta<CaptionedImageStoryProps> = {
  title: 'Components/Images/CaptionedImage',
  component: CaptionedImage,
  args: {
    ...captionedImage(),
    hasCaption: true,
    isZoomable: true,
    displayWorkLink: true,
    hasRoundedCorners: false,
    hasPreCaptionNode: false,
    preCaptionNode: <p>1 of 1</p>,
    isBody: false,
  },
  argTypes: {
    image: { table: { disable: true } },
    caption: { table: { disable: true } },
    preCaptionNode: { table: { disable: true } },
    isZoomable: { name: 'Is zoomable' },
    hasRoundedCorners: { name: 'Has rounded corners' },
    hasCaption: { name: 'Has caption' },
    displayWorkLink: { name: 'Display work link under image' },
    hasPreCaptionNode: { name: 'Has pre-caption content' },
    isBody: { name: 'Is in body; changes some styles' },
  },
};

export default meta;

type Story = StoryObj<CaptionedImageStoryProps>;

export const Basic: Story = {
  name: 'CaptionedImage',
  render: args => {
    const { hasCaption, caption, hasPreCaptionNode, preCaptionNode, ...rest } =
      args;

    return (
      <CaptionedImage
        caption={hasCaption ? caption : []}
        preCaptionNode={hasPreCaptionNode ? preCaptionNode : undefined}
        {...rest}
      />
    );
  },
};
