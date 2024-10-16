import { Meta, StoryObj } from '@storybook/react';

import { bannerCardItem } from '@weco/cardigan_new/stories/data/content';
import BannerCard from '@weco/content/components/BannerCard/BannerCard';

const meta: Meta<typeof BannerCard> = {
  title: 'Components/Cards/BannerCard',
  component: BannerCard,
  args: {
    item: bannerCardItem,
  },
};

export default meta;

type Story = StoryObj<typeof BannerCard>;
export const Basic: Story = {
  name: 'BannerCard',
};
