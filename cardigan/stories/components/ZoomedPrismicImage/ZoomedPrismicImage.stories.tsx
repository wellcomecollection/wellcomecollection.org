import { Meta, StoryObj } from '@storybook/react';

import { squareImage } from '@weco/cardigan/stories/data/images';
import ZoomedPrismicImage from '@weco/content/views/components/ZoomedPrismicImage';

const meta: Meta<typeof ZoomedPrismicImage> = {
  title: 'Components/ZoomedPrismicImage',
  component: ZoomedPrismicImage,
  args: {
    image: squareImage(),
  },
  argTypes: {
    image: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<typeof ZoomedPrismicImage>;

export const Basic: Story = {
  name: 'ZoomedPrismicImage',
  render: args => <ZoomedPrismicImage {...args} />,
};
