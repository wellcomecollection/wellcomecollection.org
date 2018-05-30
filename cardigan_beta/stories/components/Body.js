import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs/react';
import Body from '../../../common/views/components/Body/Body';
import {image, text as textContent, videoEmbed} from '../content';

const stories = storiesOf('Components', module).addDecorator(withKnobs);

const BodyComponent = <Body
  body={[{
    type: 'picture',
    value: image
  }, {
    type: 'text',
    value: textContent
  }, {
    type: 'videoEmbed',
    value: videoEmbed
  }]}
/>;

export default BodyComponent;

stories
  .add('Body', () => BodyComponent);
