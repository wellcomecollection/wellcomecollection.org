import { Meta, StoryObj } from '@storybook/react';

import { captionedImage } from '@weco/cardigan/stories/data/images';
import CaptionedImage from '@weco/content/views/components/CaptionedImage';

const meta: Meta<typeof CaptionedImage> = {
  title: 'Components/CaptionedImage',
  component: CaptionedImage,
  args: captionedImage(),
};

export default meta;

type Story = StoryObj<typeof CaptionedImage>;

export const Basic: Story = {
  name: 'CaptionedImage',
};
