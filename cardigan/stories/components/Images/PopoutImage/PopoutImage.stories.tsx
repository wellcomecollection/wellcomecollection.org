import { Meta, StoryObj } from '@storybook/react';

import {
  bookImageUrl,
  image as contentImage,
} from '@weco/cardigan/stories/data/images';
import PopoutImage from '@weco/content/views/components/PopoutImage';

const meta: Meta<typeof PopoutImage> = {
  title: 'Components/Images/PopoutImage',
  component: PopoutImage,
  args: {
    image: contentImage(bookImageUrl),
    sizes: {
      xlarge: 1 / 6,
      large: 1 / 6,
      medium: 1 / 3,
      small: 1,
    },
    quality: 'low',
    variant: 'prismic',
  },
  argTypes: {
    image: { table: { disable: true } },
    sizes: { table: { disable: true } },
    maxWidth: { table: { disable: true } },
    imgSizes: { table: { disable: true } },
    quality: { table: { disable: true } },
    variant: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<typeof PopoutImage>;

export const Basic: Story = {
  name: 'PopoutImage',
  render: args => (
    <div style={{ maxWidth: '400px' }}>
      <PopoutImage {...args} />
    </div>
  ),
};
