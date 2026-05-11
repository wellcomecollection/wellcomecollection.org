import { Meta, StoryObj } from '@storybook/react';

import { portraitVideoItems } from '@weco/cardigan/stories/data/videos';
import PortraitVideoList from '@weco/content/views/components/PortraitVideoList';

const meta: Meta<typeof PortraitVideoList> = {
  title: 'Components/Media/PortraitVideoEmbedList',
  component: PortraitVideoList,
  args: {
    title: 'Short films',
    items: portraitVideoItems,
    useShim: true,
  },
  argTypes: {
    items: { table: { disable: true } },
    gridSizes: { table: { disable: true } },
    useShim: { table: { disable: true } },
  },
  parameters: {
    chromatic: {
      viewports: [375, 1200],
    },
  },
};

export default meta;

type Story = StoryObj<typeof PortraitVideoList>;

export const Basic: Story = {
  name: 'PortraitVideoEmbedList',
};
