import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { image } from '@weco/cardigan/stories/data/images';
import { smallText } from '@weco/cardigan/stories/data/text';
import ExhibitionCaptions from '@weco/content/components/ExhibitionCaptions';
import Readme from '@weco/content/components/ExhibitionCaptions/README.mdx';

const meta: Meta<typeof ExhibitionCaptions> = {
  title: 'Components/ExhibitionCaptions',
  component: ExhibitionCaptions,
  args: {
    stops: [
      {
        number: 6,
        image: image(),
        displayTitle: '',
        anchorId: '',
        captionsOrTranscripts: {
          title: 'Stockport Spider-Man',
          standaloneTitle: '',
          tombstone: smallText(),
          caption: smallText(),
          transcription: smallText(),
          context: undefined,
        },
      },
      {
        number: 7,
        displayTitle: '',
        anchorId: '',
        captionsOrTranscripts: {
          title: 'Sagacity: The Periodic Table of Emotions',
          standaloneTitle: '',
          tombstone: smallText(),
          caption: smallText(),
          context: undefined,
        },
      },
    ],
  },
};

export default meta;

type Story = StoryObj<typeof ExhibitionCaptions>;

export const Basic: Story = {
  name: 'ExhibitionCaptions',
  render: args => (
    <ReadmeDecorator
      WrappedComponent={ExhibitionCaptions}
      args={args}
      Readme={Readme}
    />
  ),
};
