import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs/react';

import Body from '../../../common/views/components/Body/Body';
import {image, text as textContent, videoEmbed} from '../content';

const stories = storiesOf('Components', module).addDecorator(withKnobs);

const BaseBody = <Body
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

export default BaseBody;

stories
  .add('Body', () => {
    return (
      BaseBody
    );
  });
