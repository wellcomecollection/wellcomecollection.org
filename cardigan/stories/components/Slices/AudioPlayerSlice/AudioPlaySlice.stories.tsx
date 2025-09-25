import { linkTo } from '@storybook/addon-links';
import { Meta, StoryObj } from '@storybook/react';

import { audioPlayerSlice } from '@weco/cardigan/stories/data/slices';
import Buttons from '@weco/common/views/components/Buttons';
import AudioPlayer from '@weco/common/views/slices/AudioPlayer';

const meta: Meta<typeof AudioPlayer> = {
  title: 'Slices/AudioPlayer',
  component: AudioPlayer,
  args: { slice: audioPlayerSlice },
  argTypes: {
    slice: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<typeof AudioPlayer>;

export const Basic: Story = {
  name: 'AudioPlayer',
  render: args => {
    return (
      <>
        <AudioPlayer {...args} />

        <p style={{ marginTop: '50px' }}>
          Component used:{' '}
          <Buttons
            variant="ButtonSolid"
            clickHandler={linkTo(`Components/AudioPlayer`)}
            text="AudioPlayer"
          />
        </p>
      </>
    );
  },
};
