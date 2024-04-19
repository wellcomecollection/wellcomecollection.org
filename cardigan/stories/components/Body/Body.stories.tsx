import Body from '@weco/content/components/Body/Body';
import { videoEmbed, quote } from '@weco/cardigan/stories/data/content';
import {
  captionedImage,
  imageGallery,
} from '@weco/cardigan/stories/data/images';
import { text as textContent } from '@weco/cardigan/stories/data/text';

const Template = args => <Body {...args} />;
export const basic = Template.bind({});
basic.args = {
  untransformedBody: [],
  body: [
    {
      type: 'picture',
      value: captionedImage(),
    },
    {
      type: 'text',
      value: textContent(),
    },
    {
      type: 'videoEmbed',
      value: videoEmbed,
    },
    {
      type: 'text',
      value: textContent(),
    },
    {
      type: 'imageGallery',
      value: imageGallery(),
    },
    {
      type: 'text',
      value: textContent(),
    },
    {
      type: 'quote',
      value: quote(),
    },
  ],
};
basic.storyName = 'Body';
