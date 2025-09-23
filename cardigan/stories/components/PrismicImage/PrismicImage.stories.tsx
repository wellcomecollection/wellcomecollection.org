import { Meta, StoryObj } from '@storybook/react';

import { image as contentImage } from '@weco/cardigan/stories/data/images';
import PrismicImage from '@weco/common/views/components/PrismicImage';

const meta: Meta<typeof PrismicImage> = {
  title: 'Components/PrismicImage',
  component: PrismicImage,
  args: {
    image: contentImage(),
    quality: 'low',
    sizes: {
      xlarge: 1,
      large: 1,
      medium: 1,
      small: 1,
    },
    maxWidth: 500,
    desaturate: false,
  },
  argTypes: {
    quality: { table: { disable: true } },
    image: { table: { disable: true } },
    sizes: { table: { disable: true } },
    imgSizes: { table: { disable: true } },
    maxWidth: { control: 'number', name: 'Max width (px)' },
    desaturate: { control: 'boolean', name: 'Desaturate image' },
  },
};

export default meta;

type Story = StoryObj<typeof PrismicImage>;

export const Basic: Story = {
  name: 'PrismicImage',
  render: args => (
    <div style={{ maxWidth: args.maxWidth }}>
      <PrismicImage {...args} />
    </div>
  ),
};
