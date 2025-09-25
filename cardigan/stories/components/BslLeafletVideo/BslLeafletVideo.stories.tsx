import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps, useState } from 'react';

import {
  transformedVimeoEmbed,
  transformedYoutubeEmbed,
} from '@weco/cardigan/stories/data/media';
import BslLeafletVideo from '@weco/content/views/components/BslLeafletVideo';

type StoryProps = ComponentProps<typeof BslLeafletVideo> & {
  videoProvider: 'YouTube' | 'Vimeo';
};

const meta: Meta<StoryProps> = {
  title: 'Components/BslLeafletVideo',
  component: BslLeafletVideo,
  args: {
    video: {
      ...transformedYoutubeEmbed,
      title: 'BSL welcome to Rooted Beings',
    },
    videoProvider: 'YouTube',
  },
  argTypes: {
    isModalActive: { table: { disable: true } },
    setIsModalActive: { table: { disable: true } },
    video: { table: { disable: true } },
    videoProvider: {
      name: 'Video provider',
      control: { type: 'radio' },
      options: ['YouTube', 'Vimeo'],
    },
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

const Template = args => {
  const [isModalActive, setIsModalActive] = useState(false);
  const { videoProvider, ...rest } = args;
  const finalArgs = {
    ...rest,
    isModalActive,
    setIsModalActive,
    ...{
      video:
        videoProvider === 'YouTube'
          ? {
              ...transformedYoutubeEmbed,
              title: 'BSL welcome to Rooted Beings',
            }
          : { ...transformedVimeoEmbed, title: 'BSL welcome to Rooted Beings' },
    },
  };

  return <BslLeafletVideo {...finalArgs} />;
};

export const Basic: Story = {
  name: 'BslLeafletVideo',
  render: Template,
};
