import { Meta, StoryObj } from '@storybook/react';
import { themeColors } from '@weco/cardigan/.storybook/preview';

import { image as contentImage } from '@weco/cardigan/stories/data/images';
import DecorativeEdge from '@weco/common/views/components/DecorativeEdge';
import PrismicImage from '@weco/common/views/components/PrismicImage';

const meta: Meta<typeof DecorativeEdge> = {
  title: 'Components/DecorativeEdge/WEdge',
  component: DecorativeEdge,
  args: {
    color: 'warmNeutral.300',
    variant: 'w',
  },
  argTypes: {
    color: {
      options: themeColors.map(c => c.name),
      control: { type: 'radio' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof DecorativeEdge>;

export const Basic: Story = {
  name: 'WEdge',
  render: args => (
    <div style={{ maxWidth: '500px' }}>
      <PrismicImage image={contentImage()} quality="low" />
      <DecorativeEdge {...args} />
    </div>
  ),
};
