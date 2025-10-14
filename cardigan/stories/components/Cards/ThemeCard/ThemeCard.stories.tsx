import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';

import { mockIIIFImagesUrls } from '@weco/cardigan/stories/data/mock-iiif-images';
import ThemeCard from '@weco/common/views/components/ThemeCard';
import { ConceptImagesArray } from '@weco/content/hooks/useConceptImageUrls';

type StoryProps = ComponentProps<typeof ThemeCard> & {
  imageCount: number;
};

const meta: Meta<StoryProps> = {
  title: 'Components/Cards/ThemeCard',
  component: ThemeCard,
  argTypes: {
    images: { table: { disable: true } },
    linkProps: { table: { disable: true } },
    dataGtmProps: { table: { disable: true } },
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

type Story = StoryObj<StoryProps>;

export const Basic: Story = {
  name: 'ThemeCard',
  args: {
    title: 'Photography',
    description:
      'The art and science of creating images using light and cameras',
    linkProps: {
      href: {
        pathname: '#',
        query: {
          conceptId: 'abc123',
        },
      },
    },
    imageCount: 4,
  },
  render: args => {
    const { imageCount = 4, ...componentProps } = args;
    const selectedImages = mockIIIFImagesUrls.slice(
      0,
      Math.max(0, Math.min(4, imageCount))
    );

    return (
      <ThemeCard
        {...componentProps}
        images={selectedImages as ConceptImagesArray}
      />
    );
  },
};
