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
      lg: 1 / 6,
      md: 1 / 6,
      sm: 1 / 3,
      zero: 1,
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

type Story = StoryObj<typeof PopoutImage>;

export const Basic: Story = {
  name: 'PopoutImage',
  render: args => (
    <div style={{ maxWidth: '400px' }}>
      <PopoutImage {...args} />
    </div>
  ),
};
