import {Fragment} from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs/react';

import BasicBody from '../../common/views/components/BasicBody/BasicBody';
import {image, text as textContent, videoEmbed} from './content';

const stories = storiesOf('Basic body', module).addDecorator(withKnobs);

stories
  .add('without an image', () => {
    return (
      <Fragment>
        <BasicBody
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
