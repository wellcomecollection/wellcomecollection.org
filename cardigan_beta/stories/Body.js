import {Fragment} from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs/react';

import Body from '../../common/views/components/Body/Body';
import {image, text as textContent, videoEmbed} from './content';

const stories = storiesOf('Basic body', module).addDecorator(withKnobs);

stories
  .add('slices', () => {
    return (
      <Fragment>
        <Body
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
        />
      </Fragment>
    );
  });
