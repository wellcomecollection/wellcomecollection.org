import { linkTo } from '@storybook/addon-links';
import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';

import { embedSlice } from '@weco/cardigan/stories/data/media';
import Buttons from '@weco/common/views/components/Buttons';
import EmbedSlice from '@weco/common/views/slices/Embed';

type StoryProps = ComponentProps<typeof EmbedSlice> & {
  media: 'youtube' | 'vimeo' | 'soundcloud';
};

const meta: Meta<StoryProps> = {
  title: 'Slices/Embed',
  component: EmbedSlice,
  args: {
    slice: embedSlice('youtube'),
    media: 'youtube',
  },
  argTypes: {
    slice: { table: { disable: true } },
    media: {
      name: 'Supported media sources',
      options: ['youtube', 'vimeo', 'soundcloud'],
      control: 'radio',
      mapping: {
        YouTube: 'youtube',
        Vimeo: 'vimeo',
        SoundCloud: 'soundcloud',
      },
    },
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Basic: Story = {
  name: 'Embed',
  render: args => {
    args.slice = embedSlice(args.media);

    return (
      <>
        <EmbedSlice {...args} />

        <p style={{ marginTop: '50px' }}>
          Component used:{' '}
          <Buttons
            variant="ButtonSolid"
            clickHandler={linkTo(
              `Components/${args.media === 'soundcloud' ? 'SoundCloudEmbed' : 'VideoEmbed'}`
            )}
            text={
              args.media === 'soundcloud' ? 'SoundCloudEmbed' : 'VideoEmbed'
            }
          />
        </p>
      </>
    );
  },
};
