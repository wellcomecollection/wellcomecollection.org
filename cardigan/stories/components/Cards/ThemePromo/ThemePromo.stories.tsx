import { Meta, StoryObj } from '@storybook/react';

import mockImages from '@weco/cardigan/stories/data/mock-iiif-images';
import ThemePromo from '@weco/common/views/components/ThemePromo';
import { Image } from '@weco/content/services/wellcome/catalogue/types';

type StoryArgs = {
  imageCount: number;
  title: string;
  description: string;
  url: string;
  images?: never; // Hidden prop
};

const meta: Meta<StoryArgs> = {
  title: 'Components/Cards/ThemePromo',
  component: ThemePromo,
  argTypes: {
    images: {
      table: {
        disable: true,
      },
    },
    imageCount: {
      control: { type: 'range', min: 0, max: 4, step: 1 },
      description: 'Number of images to display (0-4)',
    },
  },
  parameters: {
    gridSizes: {
      s: [12],
      m: [6],
      l: [4],
      xl: [4],
    },
  },
};

export default meta;

type Story = StoryObj<StoryArgs>;

export const Basic: Story = {
  name: 'ThemePromo',
  args: {
    title: 'Photography',
    description:
      'The art and science of creating images using light and cameras',
    url: '#',
    imageCount: 4,
  },
  render: args => {
    const { imageCount = 4, ...componentProps } = args;
    const selectedImages = mockImages.slice(
      0,
      Math.max(0, Math.min(4, imageCount))
    );

    return (
      <ThemePromo
        {...componentProps}
        images={selectedImages as [Image?, Image?, Image?, Image?]}
      />
    );
  },
};
