import ExhibitionCaptions from '@weco/content/components/ExhibitionCaptions/ExhibitionCaptions';
import { text, image } from '../../content';

const Template = args => <ExhibitionCaptions {...args} />;
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
