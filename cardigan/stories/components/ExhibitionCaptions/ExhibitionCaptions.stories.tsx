import ExhibitionCaptions from '@weco/content/components/ExhibitionCaptions/ExhibitionCaptions';
import { singleLineOfText, text, image } from '../../content';

const Template = args => <ExhibitionCaptions {...args} />;
export const basic = Template.bind({});
basic.args = {
  stops: [
    {
      number: 6,
      title: 'Stockport Spider-Man',
      image: image(),
      tombstone: singleLineOfText(),
      caption: text(),
      transcription: text(),
    },
    {
      number: 7,
      title: 'Sagacity: The Periodic Table of Emotions',
      tombstone: singleLineOfText(),
      caption: text(),
    },
  ],
};
basic.storyName = 'ExhibitionCaptions';
