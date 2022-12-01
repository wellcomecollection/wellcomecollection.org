import ExhibitionCaptions from '@weco/content/components/ExhibitionCaptions/ExhibitionCaptions';
import { text, image } from '../../content';

const Template = args => <ExhibitionCaptions {...args} />;
export const basic = Template.bind({});
basic.args = {
  stops: [
    {
      number: 6,
      title: 'Stockport Spider-Man',
      image: image(),
      captionsOrTranscripts: {
        tombstone: text(),
        caption: text(),
        transcription: text(),
        context: undefined,
      },
      standaloneTitle: '',
    },
    {
      number: 7,
      title: 'Sagacity: The Periodic Table of Emotions',
      captionsOrTranscripts: {
        tombstone: text(),
        caption: text(),
        context: undefined,
      },
      standaloneTitle: '',
    },
  ],
};
basic.storyName = 'ExhibitionCaptions';
