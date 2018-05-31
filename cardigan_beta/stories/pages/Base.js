import { storiesOf } from '@storybook/react';
import BaseHeader from '../components/BaseHeader';
import BaseBody from '../components/Body';
import BasePage from '../../../common/views/components/BasePage/BasePage';
import { withKnobs } from '@storybook/addon-knobs/react';

const stories = storiesOf('Pages', module).addDecorator(withKnobs);

stories
  .add('Base page', () => (<BasePage
    id='123'
    Header={BaseHeader}
    Body={BaseBody}
  />));
