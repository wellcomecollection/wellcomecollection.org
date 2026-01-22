import { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';

import { GifVideoSlice as RawGifVideoSlice } from '@weco/common/prismicio-types';
import { transformGifVideoSlice } from '@weco/content/services/prismic/transformers/body';
import GifVideo from '@weco/content/views/components/GifVideo';

const slice: RawGifVideoSlice = {
  variation: 'default',
  version: 'initial',
  items: [],
  primary: {
    caption: [
      {
        type: 'paragraph',
        text: 'Signkid performs ‘Listen With Your Eyes’.',
        spans: [],
      },
    ],
    tasl: null,
    video: {
      link_type: 'Media',
      kind: 'file',
      id: 'X2iadBMAACMA8GIb',
      url: 'https://wellcomecollection.cdn.prismic.io/wellcomecollection/53aed1c6-2b3b-4255-a89f-a34f4b265739_Sign_1080.mp4',
      name: 'Sign_1080.mp4',
      size: '1679571',
    },
    playbackRate: '1',
    autoPlay: true,
    loop: true,
    mute: true,
    showControls: false,
  },
  id: 'gifVideo$e42c1bbb-79cf-4473-9b7d-b67aaa9da181',
  slice_type: 'gifVideo',
  slice_label: null,
};

const transformedSlice = transformGifVideoSlice(slice);

const meta: Meta<typeof GifVideo> = {
  title: 'Components/Media/GifVideo',
  component: GifVideo,
  args: transformedSlice?.value,
  argTypes: {
    videoUrl: { table: { disable: true } },
    caption: { table: { disable: true } },
    tasl: { table: { disable: true } },
    playbackRate: {
      name: 'Playback Rate',
      control: { type: 'range', min: 0.25, max: 4.0, step: 0.25 },
    },
    showControls: { name: 'Show Controls', control: 'boolean' },
    autoPlay: { name: 'Auto Play', control: 'boolean' },
    loop: { name: 'Loop', control: 'boolean' },
    mute: { name: 'Mute', control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof GifVideo>;

const Template = args => {
  const [finalArgs, setFinalArgs] = useState(args);

  useEffect(() => {
    setFinalArgs({
      ...args,
      autoPlay: args.autoPlay || transformedSlice?.value.autoPlay || false,
      playbackRate:
        args.playbackRate || transformedSlice?.value.playbackRate || 1,
    });
  }, [args]);

  return <GifVideo {...finalArgs} />;
};

export const Basic: Story = {
  name: 'GifVideo',
  render: Template,
};
