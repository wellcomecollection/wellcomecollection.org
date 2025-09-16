import { Meta, StoryObj } from '@storybook/react';

import mockImages from '@weco/cardigan/stories/components/CatalogueImageGallery/mock-images';
import ConceptCard from '@weco/common/views/components/ConceptCard';
import { Image } from '@weco/content/services/wellcome/catalogue/types';

// Import existing mock images from the shared data

// Select the first 4 images for the Photography concept
const photographyImages: [Image, Image, Image, Image] = [
  mockImages[0],
  mockImages[1],
  mockImages[2],
  mockImages[3],
];

const meta: Meta<typeof ConceptCard> = {
  title: 'Components/Cards/ConceptCard',
  component: ConceptCard,
  argTypes: {
    images: {
      table: {
        disable: true,
      },
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

type Story = StoryObj<typeof ConceptCard>;

export const Basic: Story = {
  name: 'ConceptCard',
  args: {
    images: photographyImages,
    title: 'Photography',
    description:
      'The art and science of creating images using light and cameras',
    url: '#',
  },
};
