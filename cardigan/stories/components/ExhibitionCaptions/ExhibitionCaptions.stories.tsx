import ExhibitionCaptions from '@weco/content/components/ExhibitionCaptions/ExhibitionCaptions';
import Readme from '@weco/content/components/ExhibitionCaptions/README.md';
import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { text } from '@weco/cardigan/stories/data/text';
import { image } from '@weco/cardigan/stories/data/images';

const Template = args => (
  <ReadmeDecorator
    WrappedComponent={ExhibitionCaptions}
    args={args}
    Readme={Readme}
  />
);
export const basic = Template.bind({});
basic.args = {
  stops: [
    {
      number: 6,
      image: image(),
      captionsOrTranscripts: {
        title: 'Stockport Spider-Man',
        standaloneTitle: '',
        tombstone: text(),
        caption: text(),
        transcription: text(),
        context: undefined,
      },
    },
    {
      number: 7,
      captionsOrTranscripts: {
        title: 'Sagacity: The Periodic Table of Emotions',
        standaloneTitle: '',
        tombstone: text(),
        caption: text(),
        context: undefined,
      },
    },
  ],
};
basic.storyName = 'ExhibitionCaptions';
