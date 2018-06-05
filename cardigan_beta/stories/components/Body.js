import { storiesOf } from '@storybook/react';
import Body from '../../../common/views/components/Body/Body';
import {captionedImage, text as textContent, videoEmbed, imageGallery, quote} from '../content';

const stories = storiesOf('Components', module);
// TODO: Find an easy way to get content in here.
// search results and content lists aren't working.
const BodyComponent = <Body
  body={[{
    type: 'picture',
    value: captionedImage()
  }, {
    type: 'text',
    value: textContent()
  }, {
    type: 'videoEmbed',
    value: videoEmbed
  }, {
    type: 'text',
    value: textContent()
  },
  {
    type: 'imageGallery',
    value: imageGallery()
  }, {
    type: 'text',
    value: textContent()
  },
  {
    type: 'quote',
    value: quote()
  }
  ]}
/>;

export default BodyComponent;

stories
  .add('Body', () => BodyComponent);
