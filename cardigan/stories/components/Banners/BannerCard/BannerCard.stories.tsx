import { Meta, StoryObj } from '@storybook/react';

import { bannerCardItem } from '@weco/cardigan/stories/data/content';
import BannerCard from '@weco/content/views/components/ContentPage/ContentPage.BannerCard';

const meta: Meta<typeof BannerCard> = {
  title: 'Components/Banners/BannerCard',
  component: BannerCard,
  args: {
    item: bannerCardItem,
  },
  argTypes: {
    item: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<typeof BannerCard>;
export const Basic: Story = {
  name: 'BannerCard',
};
