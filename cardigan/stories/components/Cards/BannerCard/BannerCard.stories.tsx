import { Meta, StoryObj } from '@storybook/react';

import { bannerCardItem } from '@weco/cardigan/stories/data/content';
import BannerCard from '@weco/content/components/BannerCard/BannerCard';

const meta: Meta<typeof BannerCard> = {
  title: 'Components/Cards/BannerCard',
  component: BannerCard,
};

export default meta;

type Story = StoryObj<typeof BannerCard>;
export const Basic: Story = {
  name: 'BannerCard',
  args: {
    item: bannerCardItem,
  },
};
