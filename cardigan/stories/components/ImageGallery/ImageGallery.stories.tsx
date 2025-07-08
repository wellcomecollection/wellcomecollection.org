import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { captionedImage } from '@weco/cardigan/stories/data/images';
import ImageGallery from '@weco/content/views/components/ImageGallery';
import Readme from '@weco/content/views/components/ImageGallery/README.mdx';

const images = [...new Array(5)].map(() => captionedImage());

const meta: Meta<typeof ImageGallery> = {
  title: 'Components/ImageGallery',
  component: ImageGallery,
  render: args => (
    <ReadmeDecorator
      WrappedComponent={ImageGallery}
      args={args}
      Readme={Readme}
    />
  ),
  args: {
    items: images,
    id: 'image-gallery',
    isStandalone: false,
  },
};

export default meta;

type Story = StoryObj<typeof ImageGallery>;

export const Inline: Story = {
  name: 'Inline',
  args: {
    isStandalone: false,
  },
};

export const Standalone: Story = {
  name: 'Standalone',
  args: {
    isStandalone: true,
  },
};

export const Frames: Story = {
  name: 'Frames',
  args: {
    isFrames: true,
  },
};
