import { storiesOf } from '@storybook/react';
import { Base as BaseHeader } from '../components/Headers';
import BaseBody from '../components/Body';
import BasePage from '../../../common/views/components/BasePage/BasePage';

const stories = storiesOf('Pages', module);

stories
  .add('Base page', () => (<BasePage
    id='123'
    Header={<BaseHeader />}
    Body={BaseBody}
  />));
