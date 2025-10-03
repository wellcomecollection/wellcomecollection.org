import { Meta, StoryObj } from '@storybook/react';

import {
  bookImageUrl,
  image as contentImage,
} from '@weco/cardigan/stories/data/images';
import BookImage from '@weco/content/views/components/BookImage';

const meta: Meta<typeof BookImage> = {
  title: 'Components/Images/BookImage',
  component: BookImage,
  args: {
    image: contentImage(bookImageUrl),
    sizes: {
      xlarge: 1 / 6,
      large: 1 / 6,
      medium: 1 / 3,
      small: 1,
    },
    quality: 'low',
  },
  argTypes: {
    image: { table: { disable: true } },
    sizes: { table: { disable: true } },
    maxWidth: { table: { disable: true } },
    imgSizes: { table: { disable: true } },
    quality: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<typeof BookImage>;

export const Basic: Story = {
  name: 'BookImage',
  render: args => (
    <div style={{ maxWidth: '400px' }}>
      <BookImage {...args} />
    </div>
  ),
};
